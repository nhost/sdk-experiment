package gen

import (
	"strings"

	"github.com/pb33f/libopenapi/datamodel/high/base"
)

func getNameFromComponentRef(ref string) string {
	return strings.Split(ref, "/")[3]
}

type Processor interface {
	TemplateName() string
	TypeName(name string) string
	PropertyName(prop *Property) string
	PropertyType(prop *Property) string
	MethodName(name string) string
	MethodArgumentName(name string) string
	MethodArgumentType(m *Method) string
	MethodReturnType(responseTypes map[string]map[string]string) string
	MethodPath(path string) string
	ParameterName(name string) string
	ParameterType(param *Parameter) string
}

type TypescriptProcessor struct{}

func (p *TypescriptProcessor) TemplateName() string {
	return "templates/typescript.tmpl"
}

func (p *TypescriptProcessor) nativeType(proxy *base.SchemaProxy) (string, bool) {
	switch proxy.Schema().Type[0] {
	case "integer":
		return "number", true
	case "string":
		return "string", true
	case "boolean":
		return "boolean", true
	case "array":
		item, ok := p.nativeType(proxy.Schema().Items.A)
		if !ok {
			return "", false
		}
		return item + "[]", true
	}

	if proxy.Schema().AdditionalProperties.B {
		return "Record<string, any>", true
	}

	return "", false
}

func (p *TypescriptProcessor) TypeName(name string) string {
	return ToCamelCase(name)
}

func (p *TypescriptProcessor) PropertyName(prop *Property) string {
	return prop.name
}

func (p *TypescriptProcessor) PropertyType(prop *Property) string { //nolint:cyclop
	schema := prop.typ.SchemaProxy.Schema()

	native, ok := p.nativeType(prop.typ.SchemaProxy)
	if ok {
		return native
	}

	switch schema.Type[0] {
	case "object":
		if prop.typ.SchemaProxy.IsReference() {
			return getNameFromComponentRef(prop.typ.SchemaProxy.GetReference())
		}

		return p.TypeName(prop.parentName) + strings.Title(prop.name)
	case "array":
		item := schema.Items.A
		var name string
		switch s := item.Schema().Type[0]; s {
		case "object", "array":
			if !item.IsReference() {
				panic(prop.typ.SchemaName + ": arrays must point to a reference")
			}
			name = getNameFromComponentRef(item.GetReference())
		default:
			name = item.Schema().Type[0]
		}
		return name + "[]"
	default:
		panic(prop.typ.SchemaName + ": unsupported type " + schema.Type[0])
	}
}

func (p *TypescriptProcessor) MethodName(name string) string {
	return name
}

func (p *TypescriptProcessor) MethodArgumentName(name string) string {
	return LowerFirstLetter(p.MethodName(name)) + "Request"
}

func (p *TypescriptProcessor) MethodArgumentType(m *Method) string {
	types := make([]string, 0, len(m.RequestTypes))
	for _, t := range m.RequestTypes {
		types = append(types, m.p.TypeName(t))
	}

	return strings.Join(types, "|")
}

func (p *TypescriptProcessor) MethodReturnType(responseTypes map[string]map[string]string) string {
	if len(responseTypes) == 0 {
		return "void"
	}

	successes := make([]string, 0)
	for code, m := range responseTypes {
		for _, t := range m {
			if code < "400" {
				successes = append(successes, ToCamelCase(t))
			}
		}
	}

	if len(successes) == 0 {
		successes = append(successes, "void")
	}

	return strings.Join(successes, "|")
}

func (p *TypescriptProcessor) ParameterName(name string) string {
	return name
}

func (p *TypescriptProcessor) ParameterType(param *Parameter) string {
	t, ok := p.nativeType(param.schema.Schema)
	if !ok {
		panic("unsupported parameter type: " + param.name)
	}
	return t
}

func (p *TypescriptProcessor) MethodPath(path string) string {
	return strings.ReplaceAll(path, "{", "${")
}
