package processor

import (
	"encoding/json"
	"fmt"
	"io"
	"strings"
	"text/template"

	"github.com/pb33f/libopenapi"
	"github.com/pb33f/libopenapi/datamodel/high/base"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
)

type InterMediateRepresentation struct {
	plugin Plugin
	Types  []Type
}

/*
When processing the OpenAPI document, we need to create an intermediate representation.

In this represntation, we create:

- Create a type for each schema in the OpenAPI document.
- Create a type for each nested object inside another object.
- Create a type for each enum in the OpenAPI document.
*/
func NewInterMediateRepresentation(
	doc *libopenapi.DocumentModel[v3.Document], plugin Plugin,
) (*InterMediateRepresentation, error) {
	types := make([]Type, 0, 10) //nolint:mnd

	for schemaPairs := doc.Model.Components.Schemas.First(); schemaPairs != nil; schemaPairs = schemaPairs.Next() {
		schemaName := schemaPairs.Key()
		proxy := schemaPairs.Value()

		if proxy.Schema() != nil && len(proxy.Schema().Type) > 0 {
			_, tt, err := GetType(proxy, schemaName, plugin)
			if err != nil {
				return nil, fmt.Errorf("failed to create type %s: %w", schemaName, err)
			}

			// types = append(types, t)
			types = append(types, tt...)
		} else {
			return nil, fmt.Errorf("%w: schema %s is not an object", ErrUnknownType, schemaName)
		}
	}

	return &InterMediateRepresentation{
		plugin: plugin,
		Types:  types,
	}, nil
}

func (ir *InterMediateRepresentation) Render(out io.Writer) error {
	interfaceTemplate, err := template.New("interface.ts.tmpl").Funcs(template.FuncMap{
		"join":    strings.Join,
		"example": templateFnExample,
		"pattern": templateFnPattern,
		"format":  templateFnFormat,
	}).Parse(ir.plugin.GetTemplate())
	if err != nil {
		return fmt.Errorf("failed to parse interface template: %w", err)
	}

	if err := interfaceTemplate.Execute(out, ir); err != nil {
		return fmt.Errorf("failed to execute template: %w", err)
	}

	return nil
}

type getSchemaer interface {
	Schema() *base.SchemaProxy
}

func templateFnExample(obj getSchemaer) string {
	if obj.Schema().Schema().Example == nil {
		return ""
	}

	var a any
	if err := obj.Schema().Schema().Example.Decode(&a); err != nil {
		return fmt.Sprintf("Error decoding example: %v", err)
	}

	b, err := json.Marshal(a)
	if err != nil {
		return fmt.Sprintf("Error marshaling example: %v", err)
	}

	return string(b)
}

func templateFnPattern(obj getSchemaer) string {
	return obj.Schema().Schema().Pattern
}

func templateFnFormat(obj getSchemaer) string {
	return obj.Schema().Schema().Format
}
