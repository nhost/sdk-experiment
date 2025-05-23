package typescript

import (
	_ "embed"
	"fmt"
	"strings"

	"github.com/nhost/sdk-experiment/tools/codegen/processor"
)

func ToCamelCase(s string) string {
	// Split the string by hyphens
	parts := strings.Split(s, "-")
	for i := range parts {
		// Capitalize the first letter of each part
		parts[i] = strings.Title(parts[i])
	}
	// Join the parts together without spaces
	return strings.Join(parts, "")
}

func LowerFirstLetter(s string) string {
	if len(s) == 0 {
		return s // return empty string if input is empty
	}
	return strings.ToLower(string(s[0])) + s[1:]
}

//go:embed typescript.tmpl
var templateContents []byte

type Typescript struct{}

func (t *Typescript) GetTemplate() string {
	return string(templateContents)
}

func (t *Typescript) TypeObjectName(name string) string {
	return ToCamelCase(name)
}

func (t *Typescript) TypeScalarName(scalar *processor.TypeScalar) string {
	return scalar.Schema().Schema().Type[0]
}

func (t *Typescript) TypeArrayName(array *processor.TypeArray) string {
	return array.Item.Name() + "[]"
}

func (t *Typescript) TypeEnumName(name string) string {
	return "Enum" + ToCamelCase(name)
}

func (t *Typescript) TypeEnumValues(values []any) []string {
	enumValues := make([]string, len(values))
	if len(values) == 0 {
		return enumValues
	}

	f := values[0]
	if _, ok := f.(string); ok {
		for i, v := range values {
			enumValues[i] = fmt.Sprintf("\"%s\"", v)
		}
		return enumValues
	}

	for i, v := range values {
		enumValues[i] = fmt.Sprintf("%v", v)
	}

	return enumValues
}
