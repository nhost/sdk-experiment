package gen

import (
	"fmt"
	"slices"

	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

type Parameter struct {
	name   string
	schema *v3.Parameter
	p      Processor
}

func (p *Parameter) Name() string {
	return p.p.ParameterName(p.name)
}

func (p *Parameter) Type() string {
	return p.p.ParameterType(p)
}

func (p *Parameter) Required() bool {
	if p.schema.Required == nil {
		return false
	}
	return *p.schema.Required
}

type Method struct {
	path            string
	Op              *v3.Operation
	Method          string
	p               Processor
	PathParameters  []*Parameter
	QueryParameters []*Parameter
	RequestTypes    map[string]string
	ResponseTypes   map[string]map[string]string
}

func (m *Method) Path() string {
	return m.p.MethodPath(m.path)
}

func (m *Method) Name() string {
	if m.Op.OperationId == "" {
		panic("operationId is empty, currently unsupported")
	}
	return m.p.MethodName(m.Op.OperationId)
}

func (m *Method) RequestIsEmpty() bool {
	return len(m.RequestTypes) == 0
}

func (m *Method) RequestIsJSON() bool {
	_, ok := m.RequestTypes["application/json"]
	return ok
}

func (m *Method) RequestIsMultipart() bool {
	_, ok := m.RequestTypes["multipart/form-data"]
	return ok
}

func (m *Method) HasQueryParameters() bool {
	return len(m.QueryParameters) > 0
}

func (m *Method) QueryParametersRequired() bool {
	for _, param := range m.Op.Parameters {
		if param.In == "query" && param.Required != nil && *param.Required {
			return true
		}
	}
	return false
}

func (m *Method) ArgumentName() string {
	return m.p.MethodArgumentName(m.Name())
}

func (m *Method) ArgumentRequired() bool {
	if m.Op.RequestBody.Required == nil {
		return false
	}
	return *m.Op.RequestBody.Required
}

func (m *Method) ArgumentType() string {
	return m.p.MethodArgumentType(m)
}

func (m *Method) ReturnType() string {
	return m.p.MethodReturnType(m.ResponseTypes)
}

func (m *Method) Description() string {
	return m.Op.Description
}

func (m *Method) IsRedirect() bool {
	_, ok := m.ResponseTypes["302"]
	return ok
}

func (m *Method) Summary() string {
	return m.Op.Summary
}

func processPathItem(
	path string, pathItem *v3.PathItem, processor Processor,
) ([]*Method, []*Type, error) {
	if pathItem == nil {
		return nil, nil, nil
	}

	methods := make([]*Method, 0, 4) //nolint:mnd
	types := make([]*Type, 0, 4)     //nolint:mnd

	for s, op := range map[string]*v3.Operation{
		"GET":     pathItem.Get,
		"PUT":     pathItem.Put,
		"POST":    pathItem.Post,
		"DELETE":  pathItem.Delete,
		"OPTIONS": pathItem.Options,
		"HEAD":    pathItem.Head,
		"PATCH":   pathItem.Patch,
		"TRACE":   pathItem.Trace,
	} {
		if op == nil {
			continue
		}

		// TODO: fixme somehow
		if slices.Contains(op.Tags, "excludeme") {
			continue
		}

		m, t, err := processOperation(path, op, s, processor)
		if err != nil {
			return nil, nil, fmt.Errorf("failed to process operation: %w", err)
		}
		methods = append(methods, m)
		types = append(types, t...)
	}

	return methods, types, nil
}

func processOperation(
	path string, op *v3.Operation, method string, processor Processor,
) (*Method, []*Type, error) {
	queryParams := make([]*Parameter, 0, len(op.Parameters))
	pathParams := make([]*Parameter, 0, len(op.Parameters))
	types := make([]*Type, 0, 4) //nolint:mnd
	if op.Parameters != nil {
		for _, param := range op.Parameters {
			if needsAddedObject(param.Schema.Schema()) {
				t, err := processObject(param.Name, param.Schema, processor)
				if err != nil {
					return nil, nil, fmt.Errorf("%s: problem processing inline object: %w", param.Name, err)
				}

				types = append(types, t...)
			}

			p := &Parameter{
				name:   param.Name,
				schema: param,
				p:      processor,
			}
			if param.In == "path" {
				pathParams = append(pathParams, p)
			} else {
				queryParams = append(queryParams, p)
			}
		}
	}

	requestTypes := make(map[string]string)
	if op.RequestBody != nil {
		pair := op.RequestBody.Content.First()

		ct := pair.Key()

		n := pair.Next()
		if n != nil {
			panic("multiple content types not supported yet")
		}

		switch ct {
		case "application/json", "multipart/form-data":
			schemaProxy := pair.Value().Schema
			if schemaProxy.IsReference() {
				requestTypes[ct] = getNameFromComponentRef(schemaProxy.GetReference())
			} else {
				name := op.OperationId + "Body"
				requestTypes[ct] = name
				t, err := processObject(name, schemaProxy, processor)
				if err != nil {
					return nil, nil, fmt.Errorf("%s: problem processing inline object: %w", name, err)
				}
				types = append(types, t...)
			}
		default:
			return nil, nil,
				fmt.Errorf("%s: unsupported request content type %s", op.OperationId, ct) //nolint:goerr113
		}
	}

	responseTypes := make(map[string]map[string]string)
	if op.Responses != nil {
		for pair := op.Responses.Codes.First(); pair != nil; pair = pair.Next() {
			code := pair.Key()
			responses := pair.Value()
			responseTypes[code] = make(map[string]string)

			for rpair := responses.Content.First(); rpair != nil; rpair = rpair.Next() {
				ct := rpair.Key()
				responseType := rpair.Value()

				switch ct {
				case "application/json":
					name, t, err := processOperationResponseStructured(
						responseType, op.OperationId, code, processor,
					)
					if err != nil {
						return nil, nil, fmt.Errorf("%s: problem processing inline object: %w", name, err)
					}
					responseTypes[code][ct] = name
					types = append(types, t...)
				case "application/octet-stream":
					responseTypes[code][ct] = "application/octet-stream"
				default:
					return nil, nil,
						fmt.Errorf("%s: unsupported response content type %s", code, ct) //nolint:goerr113
				}
			}
		}
	}

	return &Method{
		path:            path,
		Op:              op,
		Method:          method,
		p:               processor,
		QueryParameters: queryParams,
		PathParameters:  pathParams,
		RequestTypes:    requestTypes,
		ResponseTypes:   responseTypes,
	}, types, nil
}

func processOperationResponseStructured(
	responseType *v3.MediaType,
	operationID string,
	code string,
	processor Processor,
) (string, []*Type, error) {
	types := make([]*Type, 0, 4) //nolint:mnd

	schemaProxy := responseType.Schema

	var name string
	if schemaProxy.IsReference() {
		name = getNameFromComponentRef(schemaProxy.GetReference())
	} else {
		name = operationID + code
		t, err := processObject(name, schemaProxy, processor)
		if err != nil {
			return "", nil, fmt.Errorf("%s: problem processing inline object: %w", name, err)
		}
		types = append(types, t...)
	}

	return name, types, nil
}
