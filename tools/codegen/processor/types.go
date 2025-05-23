package processor

import (
	"strings"

	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type TypeIdentifier string

const (
	TypeIdentifierObject TypeIdentifier = "object"
	TypeIdentifierScalar TypeIdentifier = "scalar"
	TypeIdentifierArray  TypeIdentifier = "array"
)

type Plugin interface {
	GetTemplate() string
	TypeObjectName(name string) string
	TypeScalarName(scalar *TypeScalar) string
	TypeArrayName(array *TypeArray) string
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

		var property *Property
		switch {
		case prop.Schema().Type[0] == "object" && prop.Schema().Properties != nil:
			if prop.IsReference() {
				property = &Property{
					Name:   propName,
					Parent: obj,
					Type: &TypeObject{
						schema:     prop,
						name:       getNameFromComponentRef(prop.GetReference()),
						properties: properties,
						p:          p,
					},
					p: p,
				}
			} else {
				// Create a new object type
				var newObj Type
				var err error
				name := name + strings.Title(propName)
				newObj, types, err = NewObject(name, prop, p)
				if err != nil {
					return nil, nil, err
				}
				property = &Property{
					Name:   propName,
					Parent: obj,
					Type:   newObj,
					p:      p,
				}
				types = append(types, newObj)
			}
		case prop.Schema().Type[0] == "array":
			// Create a new property
			property = &Property{
				Name:   propName,
				Parent: obj,
				Type:   &TypeArray{schema: prop, p: p},
				p:      p,
			}

		default:
			// Create a new property
			property = &Property{
				Name:   propName,
				Parent: obj,
				Type:   &TypeScalar{schema: prop, p: p},
				p:      p,
			}
		}
		properties = append(properties, property)
	}

	obj.properties = properties

	return obj, types, nil
}
