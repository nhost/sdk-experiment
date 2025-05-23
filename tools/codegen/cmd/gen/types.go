package gen

import (
	"fmt"
	"slices"
	"strconv"
	"strings"

	"github.com/pb33f/libopenapi/datamodel/high/base"
)

type Schema struct {
	Types   []*Type
	Methods []*Method
}

type Property struct {
	name       string
	parent     *base.SchemaProxy
	parentName string
	typ        *Type
	p          Processor
}

func (p *Property) Name() string {
	return p.p.PropertyName(p)
}

func (p *Property) Type() string {
	return p.p.PropertyType(p)
}

func (p *Property) Schema() *base.Schema {
	return p.typ.Schema()
}

func (p *Property) Example() string {
	if p.typ.SchemaProxy.Schema().Example == nil {
		return ""
	}
	return p.typ.SchemaProxy.Schema().Example.Value
}

func (p *Property) Format() string {
	return p.typ.SchemaProxy.Schema().Format
}

func (p *Property) MinLength() *int64 {
	return p.typ.SchemaProxy.Schema().MinLength
}

func (p *Property) MaxLength() *int64 {
	return p.typ.SchemaProxy.Schema().MaxLength
}

func (p *Property) IsRequired() bool {
	return slices.Contains(
		p.parent.Schema().Required,
		p.typ.SchemaName,
	)
}

// Type represents a type in a schema.
type Type struct {
	SchemaName  string
	SchemaProxy *base.SchemaProxy
	Properties  []*Property
	P           Processor
	union       []string
}

func (s *Type) Name() string {
	return s.P.TypeName(s.SchemaName)
}

func (s *Type) Schema() *base.Schema {
	return s.SchemaProxy.Schema()
}

func (s *Type) IsObject() bool {
	if s.SchemaProxy.Schema() == nil {
		return false
	}
	return s.SchemaProxy.Schema().Type[0] == "object"
}

func (s *Type) IsUnion() bool {
	return len(s.union) > 0
}

func (s *Type) Union() []string {
	t := make([]string, len(s.union))
	for i, u := range s.union {
		t[i] = s.P.TypeName(u)
	}
	return t
}

func (s *Type) IsEnum() bool {
	if s.SchemaProxy.Schema() == nil {
		return false
	}
	return s.SchemaProxy.Schema().Type[0] == "string" && len(s.SchemaProxy.Schema().Enum) > 0
}

type Enum struct {
	Name  string
	Value string
}

func (s *Type) Enum() []Enum {
	schema := s.SchemaProxy.Schema()
	if schema.Enum == nil {
		return nil
	}

	raw := schema.Extensions.Value("x-enumNames")
	var enumNames []string
	if raw != nil {
		if err := raw.Decode(&enumNames); err != nil {
			panic("failed to decode x-enumNames: " + err.Error())
		}
	}

	if len(enumNames) != 0 && len(enumNames) != len(schema.Enum) {
		panic("x-enumNames and enum values do not match")
	}

	enum := make([]Enum, 0, len(schema.Enum))
	for i, e := range s.SchemaProxy.Schema().Enum {
		name := e.Value
		if len(enumNames) > 0 {
			name = enumNames[i]
		}
		enum = append(enum, Enum{
			Name:  name,
			Value: e.Value,
		})
	}

	return enum
}

func needsAddedObject(schema *base.Schema) bool {
	if schema.Type[0] == "string" && len(schema.Enum) > 0 {
		return true
	}

	if schema.Type[0] == "object" && !schema.AdditionalProperties.B {
		return true
	}

	return false
}

func processObject(
	name string,
	schemaProxy *base.SchemaProxy,
	processor Processor,
) ([]*Type, error) {
	schema := schemaProxy.Schema()

	resp := make([]*Type, 0, 10) //nolint:mnd
	if schema == nil {
		panic(name + " schema is nil: wtf")
	}

	union := make([]string, 0, len(schema.AllOf))
	if len(schema.AllOf) > 0 {
		for i, a := range schema.AllOf {
			if a.IsReference() {
				union = append(union, getNameFromComponentRef(a.GetReference()))
			} else {
				n := name + "AllOf" + strconv.Itoa(i)
				t, err := processObject(n, a, processor)
				if err != nil {
					return nil, fmt.Errorf("failed to process allOf object: %w", err)
				}
				union = append(union, t[0].Name())
				resp = append(resp, t...)
			}
		}
	}

	data := &Type{
		SchemaName:  name,
		SchemaProxy: schemaProxy,
		P:           processor,
		Properties:  make([]*Property, 0, 10), //nolint:mnd
		union:       union,
	}

	resp = append(resp, data)

	for propPairs := schema.Properties.First(); propPairs != nil; propPairs = propPairs.Next() {
		propName := propPairs.Key()
		proxy := propPairs.Value()
		property := &Type{
			SchemaName:  propName,
			SchemaProxy: proxy,
			P:           processor,
			Properties:  make([]*Property, 0, 10), //nolint:mnd
		}

		data.Properties = append(data.Properties, &Property{
			name:       propName,
			typ:        property,
			p:          processor,
			parent:     schemaProxy,
			parentName: name,
		})

		if needsAddedObject(proxy.Schema()) {
			name := name + strings.Title(propName)
			r, err := processObject(name, proxy, processor)
			if err != nil {
				return nil, fmt.Errorf("failed to process object: %w", err)
			}
			resp = append(resp, r...)
		}
	}

	return resp, nil
}
