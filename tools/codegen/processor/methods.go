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
	Bodies map[string]Type
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
	params := make([]*Parameter, len(operation.Parameters))
	types := make([]Type, 0, 10) //nolint:mnd
	for i, param := range operation.Parameters {
		t, tt, err := GetType(param.Schema, method+format.Title(param.Name), processor)
		if err != nil {
			return nil, nil, fmt.Errorf("failed to get type for parameter %s: %w", param.Name, err)
		}
		types = append(types, tt...)
		params[i] = &Parameter{
			name:      param.Name,
			Parameter: param,
			Type:      t,
			p:         processor,
		}
	}

	return &Method{
		name:       operation.OperationId,
		method:     method,
		path:       path,
		Parameters: params,
		Bodies:     nil,
		Responses:  nil,
		p:          processor,
	}, types, nil
}
