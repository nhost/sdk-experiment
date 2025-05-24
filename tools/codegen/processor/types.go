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
	TypeIdentifierMap       TypeIdentifier = "map"
)

type Plugin interface {
	GetTemplate() string
	TypeObjectName(name string) string
	TypeScalarName(scalar *TypeScalar) string
	TypeArrayName(array *TypeArray) string
	TypeEnumName(name string) string
	TypeEnumValues(values []any) []string
	TypeMapName(mapType *TypeMap) string
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

type TypeMap struct {
	schema *base.SchemaProxy
	p      Plugin
}

func (t *TypeMap) Name() string {
	return t.p.TypeMapName(t)
}

func (t *TypeMap) Type() TypeIdentifier {
	return TypeIdentifierMap
}

func (t *TypeMap) Schema() *base.SchemaProxy {
	return t.schema
}

func getNameFromComponentRef(ref string) string {
	return strings.Split(ref, "/")[3]
}

func getTypeObject( //nolint:ireturn
	schema *base.SchemaProxy, derivedName string, p Plugin,
) (Type, []Type, error) {
	if schema.IsReference() {
		return &TypeObjectRef{
			schema: schema,
			name:   getNameFromComponentRef(schema.GetReference()),
			p:      p,
		}, nil, nil
	}

	if schema.Schema().Properties == nil {
		if schema.Schema().AdditionalProperties.B {
			return &TypeMap{
				schema: schema,
				p:      p,
			}, nil, nil
		}
		return nil, nil, fmt.Errorf(
			"%w: object schema %s has no properties and no additional properties", ErrUnknownType, derivedName)
	}

	t, tt, err := NewObject(derivedName, schema, p)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to create object type: %w", err)
	}

	return t, append(tt, t), nil
}

func getTypeArray(schema *base.SchemaProxy, p Plugin) (Type, []Type, error) { //nolint:ireturn
	item := schema.Schema().Items.A
	if item.IsReference() {
		return &TypeArray{
			schema: schema,
			p:      p,
			Item: &TypeObjectRef{
				schema: schema,
				name:   getNameFromComponentRef(item.GetReference()),
				p:      p,
			},
		}, nil, nil
	}
	return &TypeArray{
		schema: schema,
		p:      p,
		Item: &TypeScalar{
			schema: item,
			p:      p,
		},
	}, nil, nil
}

func getTypeEnum( //nolint:ireturn
	schema *base.SchemaProxy, derivedName string, p Plugin,
) (Type, []Type, error) {
	if schema.IsReference() {
		return &TypeEnum{
			schema: schema,
			name:   getNameFromComponentRef(schema.GetReference()),
			p:      p,
		}, nil, nil
	}

	values := make([]any, 0, len(schema.Schema().Enum))
	for _, enum := range schema.Schema().Enum {
		var v any
		if err := enum.Decode(&v); err != nil {
			return nil, nil, fmt.Errorf("failed to decode enum value %v: %w", v, err)
		}
		values = append(values, v)
	}

	t := &TypeEnum{
		name:   derivedName,
		schema: schema,
		values: values,
		p:      p,
	}
	return t, []Type{t}, nil
}

// getType determines the type of the schema and returns the corresponding Type.
// It also returns a slice of types that may include the main type and any additional types
// if those may need to be defined globally (e.g., nested objects or enums).
func GetType( //nolint:ireturn
	schema *base.SchemaProxy, derivedName string, p Plugin,
) (Type, []Type, error) {
	switch {
	case schema.Schema().Type[0] == "object":
		return getTypeObject(schema, derivedName, p)

	case schema.Schema().Type[0] == "array":
		return getTypeArray(schema, p)

	case len(schema.Schema().Enum) > 0:
		return getTypeEnum(schema, derivedName, p)

	default:
		return &TypeScalar{
			schema: schema,
			p:      p,
		}, nil, nil
	}
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

		derivedName := name + format.Title(propName)
		typ, tt, err := GetType(prop, derivedName, p)
		if err != nil {
			return nil, nil, fmt.Errorf("failed to get type for property %s: %w", propName, err)
		}

		types = append(types, tt...)

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
