package typescript

import (
	_ "embed"
	"fmt"

	"github.com/nhost/sdk-experiment/tools/codegen/format"
	"github.com/nhost/sdk-experiment/tools/codegen/processor"
)

//go:embed typescript.tmpl
var templateContents []byte

type Typescript struct{}

func (t *Typescript) GetTemplate() string {
	return string(templateContents)
}

func (t *Typescript) TypeObjectName(name string) string {
	return format.ToCamelCase(name)
}

func (t *Typescript) TypeScalarName(scalar *processor.TypeScalar) string {
	return scalar.Schema().Schema().Type[0]
}

func (t *Typescript) TypeArrayName(array *processor.TypeArray) string {
	return array.Item.Name() + "[]"
}

func (t *Typescript) TypeEnumName(name string) string {
	return "Enum" + format.ToCamelCase(name)
}

func (t *Typescript) TypeEnumValues(values []any) []string {
	enumValues := make([]string, len(values))
	if len(values) == 0 {
		return enumValues
	}

	for i, v := range values {
		if s, ok := v.(string); ok {
			enumValues[i] = fmt.Sprintf("\"%v\"", s)
		} else {
			enumValues[i] = fmt.Sprintf("%v", v)
		}
	}

	return enumValues
}

func (t *Typescript) TypeMapName(_ *processor.TypeMap) string {
	return "Record<string, unknown>"
}
