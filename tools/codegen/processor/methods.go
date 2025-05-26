package processor

import (
	"fmt"

	"github.com/nhost/sdk-experiment/tools/codegen/format"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

type Method struct {
	name       string
	method     string
	path       string
	Parameters []*Parameter
	// key is the media type (e.g., "application/json")
	Bodies       map[string]Type
	BodyRequired bool
	// first key is the response code (e.g., "200")
	// second key is the media type (e.g., "application/json")
	Responses map[string]map[string]Type
	p         Plugin
}

func (m *Method) Name() string {
	return m.p.MethodName(m.name)
}

func (m *Method) PathParameters() []*Parameter {
	params := make([]*Parameter, 0, 10) //nolint:mnd
	for _, param := range m.Parameters {
		if param.Parameter.In == "path" {
			params = append(params, param)
		}
	}
	return params
}

func (m *Method) HasQueryParameters() bool {
	for _, param := range m.Parameters {
		if param.Parameter.In == "query" {
			return true
		}
	}
	return false
}

func (m *Method) QueryParameters() []*Parameter {
	params := make([]*Parameter, 0, 10) //nolint:mnd
	for _, param := range m.Parameters {
		if param.Parameter.In == "query" {
			params = append(params, param)
		}
	}
	return params
}

func (m *Method) QueryParametersTypeName() string {
	return m.p.TypeObjectName(m.Name() + "Parameters")
}

type Parameter struct {
	name      string
	Parameter *v3.Parameter
	Type      Type
	p         Plugin
}

func (p *Parameter) Name() string {
	return p.p.ParameterName(p.name)
}

func GetMethod(
	path string,
	method string,
	operation *v3.Operation,
	processor Plugin,
) (*Method, []Type, error) {
	params, types, err := getMethodParameters(method, operation, processor)
	if err != nil {
		return nil, nil, fmt.Errorf(
			"failed to get method parameters for %s: %w",
			operation.OperationId,
			err,
		)
	}

	bodies, tt, err := getMethodBodies(operation, processor)
	if err != nil {
		return nil, nil, fmt.Errorf(
			"failed to get method bodies for %s: %w",
			operation.OperationId,
			err,
		)
	}

	types = append(types, tt...)

	return &Method{
		name:       operation.OperationId,
		method:     method,
		path:       path,
		Parameters: params,
		Bodies:     bodies,
		BodyRequired: operation.RequestBody != nil && operation.RequestBody.Required != nil &&
			*operation.RequestBody.Required,
		Responses: nil,
		p:         processor,
	}, types, nil
}

func getMethodParameters(
	method string,
	operation *v3.Operation,
	processor Plugin,
) ([]*Parameter, []Type, error) {
	params := make([]*Parameter, len(operation.Parameters))
	types := make([]Type, 0, 10) //nolint:mnd

	for i, param := range operation.Parameters {
		var t Type
		if param.GoLow().IsReference() {
			t = &TypeEnum{
				schema: param.Schema,
				name:   format.GetNameFromComponentRef(param.GoLow().GetReference()),
				values: nil, // No values for reference types
				p:      processor,
			}
		} else {
			t2, tt, err := GetType(param.Schema, method+format.Title(param.Name), processor, false)
			if err != nil {
				return nil, nil, fmt.Errorf("failed to get type for parameter %s: %w", param.Name, err)
			}
			types = append(types, tt...)
			t = t2
		}
		params[i] = &Parameter{
			name:      param.Name,
			Parameter: param,
			Type:      t,
			p:         processor,
		}
	}

	return params, types, nil
}

func getMethodBodies(
	operation *v3.Operation,
	processor Plugin,
) (map[string]Type, []Type, error) {
	bodies := make(map[string]Type)

	if operation.RequestBody == nil {
		return nil, nil, nil
	}

	pair := operation.RequestBody.Content.First()
	if pair == nil {
		return nil, nil, nil
	}

	if pair.Next() != nil {
		return nil, nil,
			fmt.Errorf(
				"%w: operation %s has multiple request bodies",
				ErrUnsupportedFeature,
				operation.OperationId,
			)
	}

	var tt []Type
	for pair := operation.RequestBody.Content.First(); pair != nil; pair = pair.Next() {
		mediaType := pair.Key()
		proxy := pair.Value()

		name := operation.OperationId + "Body"
		var t Type
		var err error
		t, tt, err = GetType(proxy.Schema, name, processor, false)
		if err != nil {
			return nil, nil, fmt.Errorf(
				"failed to get type for body with media type %s: %w",
				mediaType,
				err,
			)
		}
		bodies[mediaType] = t
	}

	return bodies, tt, nil
}
