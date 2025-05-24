package processor

import (
	"fmt"
	"strings"

	"github.com/nhost/sdk-experiment/tools/codegen/format"
	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type TypeIdentifier string

const (
	TypeIdentifierObject    TypeIdentifier = "object"
	TypeIdentifierObjectRef TypeIdentifier = "object"
	TypeIdentifierScalar    TypeIdentifier = "scalar"
	TypeIdentifierArray     TypeIdentifier = "array"
	TypeIdentifierEnum      TypeIdentifier = "enum"
)

type Plugin interface {
	GetTemplate() string
	TypeObjectName(name string) string
	TypeScalarName(scalar *TypeScalar) string
	TypeArrayName(array *TypeArray) string
	TypeEnumName(name string) string
	TypeEnumValues(values []any) []string
}

type Type interface {
	Name() string
	Type() TypeIdentifier
	Schema() *base.SchemaProxy
}

type TypeObject struct {
	name       string
	schema     *base.SchemaProxy
	properties []*Property
	p          Plugin
}

func (t *TypeObject) Name() string {
	return t.p.TypeObjectName(t.name)
}

func (t *TypeObject) Type() TypeIdentifier {
	return TypeIdentifierObject
}

func (t *TypeObject) Schema() *base.SchemaProxy {
	return t.schema
}

func (t *TypeObject) Properties() []*Property {
	return t.properties
}

type TypeObjectRef struct {
	name   string
	schema *base.SchemaProxy
	p      Plugin
}

func (t *TypeObjectRef) Name() string {
	return t.p.TypeObjectName(t.name)
}

func (t *TypeObjectRef) Type() TypeIdentifier {
	return TypeIdentifierObjectRef
}

func (t *TypeObjectRef) Schema() *base.SchemaProxy {
	return t.schema
}

type TypeEnum struct {
	name   string
	schema *base.SchemaProxy
	values []any
	p      Plugin
}

func (t *TypeEnum) Name() string {
	return t.p.TypeEnumName(t.name)
}

func (t *TypeEnum) Values() []string {
	return t.p.TypeEnumValues(t.values)
}

func (t *TypeEnum) Type() TypeIdentifier {
	return TypeIdentifierEnum
}

func (t *TypeEnum) Schema() *base.SchemaProxy {
	return t.schema
}

type TypeScalar struct {
	schema *base.SchemaProxy
	p      Plugin
}

func (t *TypeScalar) Name() string {
	return t.p.TypeScalarName(t)
}

func (t *TypeScalar) Type() TypeIdentifier {
	return TypeIdentifierScalar
}

func (t *TypeScalar) Schema() *base.SchemaProxy {
	return t.schema
}

type TypeArray struct {
	schema *base.SchemaProxy
	Item   Type
	p      Plugin
}

func (t *TypeArray) Name() string {
	return t.p.TypeArrayName(t)
}

func (t *TypeArray) Type() TypeIdentifier {
	return TypeIdentifierArray
}

func (t *TypeArray) Schema() *base.SchemaProxy {
	return t.schema
}

func getNameFromComponentRef(ref string) string {
	return strings.Split(ref, "/")[3]
}

func NewObject(
	name string,
	schema *base.SchemaProxy,
	p Plugin,
) (*TypeObject, []Type, error) {
	types := make([]Type, 0, 10)           //nolint:mnd
	properties := make([]*Property, 0, 10) //nolint:mnd

	obj := &TypeObject{
		name:       name,
		schema:     schema,
		properties: properties,
		p:          p,
	}

	for propPairs := schema.Schema().Properties.First(); propPairs != nil; propPairs = propPairs.Next() {
		propName := propPairs.Key()
		prop := propPairs.Value()

		var typ Type
		switch {
		case prop.Schema().Type[0] == "object" && prop.Schema().Properties != nil:
			if prop.IsReference() {
				typ = &TypeObjectRef{
					schema: prop,
					name:   getNameFromComponentRef(prop.GetReference()),
					p:      p,
				}
			} else {
				var err error
				name := name + format.Title(propName)
				t, tt, err := NewObject(name, prop, p)
				if err != nil {
					return nil, nil, err
				}
				typ = t
				types = append(types, typ)
				types = append(types, tt...)
			}

		case prop.Schema().Type[0] == "array":
			item := prop.Schema().Items.A
			if item.IsReference() {
				typ = &TypeArray{
					schema: prop,
					p:      p,
					Item: &TypeObjectRef{
						schema: prop,
						name:   getNameFromComponentRef(item.GetReference()),
						p:      p,
					},
				}
			} else {
				typ = &TypeArray{
					schema: prop,
					p:      p,
					Item: &TypeScalar{
						schema: item,
						p:      p,
					},
				}
			}

		case len(prop.Schema().Enum) > 0:
			values := make([]any, 0, len(prop.Schema().Enum))
			for _, enum := range prop.Schema().Enum {
				var v any
				if err := enum.Decode(&v); err != nil {
					return nil, nil, fmt.Errorf("failed to decode enum value %v: %w", v, err)
				}
				values = append(values, v)
			}

			typ = &TypeEnum{
				name:   name + format.Title(propName),
				schema: schema,
				values: values,
				p:      p,
			}

			types = append(types, typ)

		default:
			typ = &TypeScalar{
				schema: prop,
				p:      p,
			}
		}

		property := &Property{
			Name:   propName,
			Parent: obj,
			Type:   typ,
			p:      p,
		}
		properties = append(properties, property)
	}

	obj.properties = properties

	return obj, types, nil
}
