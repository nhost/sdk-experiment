package purescript

import (
	"embed"
	"fmt"
	"io/fs"
	"strings"

	"github.com/nhost/sdk-experiment/tools/codegen/format"
	"github.com/nhost/sdk-experiment/tools/codegen/processor"
)

const extCustomType = "x-ps-type"

//go:embed templates/*.tmpl
var templatesFS embed.FS

type Purescript struct{}

func (p *Purescript) GetTemplates() fs.FS {
	return templatesFS
}

func (p *Purescript) GetFuncMap() map[string]any {
	return map[string]any{
		"dashesAndOtherSeparatorsToKebabAndAddUnderscoreIfPurescriptKeyword": dashesAndOtherSeparatorsToKebabAndAddUnderscoreIfPurescriptKeyword,
    "anyPropertyIsBlob": anyPropertyIsBlob,
		"quote":                  quote,
		"ToCamelCase":            format.ToCamelCase,
		"lowerFirst":             lowerFirst,
		"containsSpaceInside":    containsSpaceInside,
		"hasValidDescription":    hasValidDescription,
		"hasPrefix":              strings.HasPrefix,
		"enumValueToConstructor": enumValueToConstructor,
		"enumValueToJsonString":  enumValueToJsonString,
		"splitLines":             splitLines,
	}
}

func (p *Purescript) TypeObjectName(name string) string {
	return format.ToCamelCase(name)
}

func (p *Purescript) TypeScalarName(scalar *processor.TypeScalar) string {
	switch scalar.Schema().Schema().Type[0] {
	case "integer":
		return "Int"
	case "number":
		return "Number"
	case "string":
		if scalar.Schema().Schema().Format == "binary" {
			return "Blob"
		}
		return "String"
	case "boolean":
		return "Boolean"
	case "null":
		return "Unit"
	case "void":
		return "Unit"
	}
	return "String"
}

func (p *Purescript) TypeArrayName(array *processor.TypeArray) string {
	return "Array " + array.Item.Name()
}

func (p *Purescript) TypeEnumName(name string) string {
	return format.ToCamelCase(name)
}

func (p *Purescript) TypeEnumValues(values []any) []string {
	enumValues := make([]string, len(values))
	if len(values) == 0 {
		return enumValues
	}

	for i, v := range values {
		if s, ok := v.(string); ok {
			enumValues[i] = format.ToCamelCase(s)
		} else {
			enumValues[i] = fmt.Sprintf("Value%v", v)
		}
	}

	return enumValues
}

func (p *Purescript) TypeMapName(schema *processor.TypeMap) string {
	if v, ok := schema.Schema().Schema().Extensions.Get(extCustomType); ok {
		return v.Value
	}
	return "J.JObject"
}

func (p *Purescript) MethodName(name string) string {
	return format.ToCamelCase(name) // Preserve proper camelCase
}

func (p *Purescript) MethodPath(name string) string {
	return strings.ReplaceAll(name, "{", "${")
}

func (p *Purescript) ParameterName(name string) string {
	return name
}

func (p *Purescript) BinaryType() string {
	return "Blob"
}

func (p *Purescript) PropertyName(name string) string {
  return name
}

// // Modified property name to handle array fields correctly
// func (p *Purescript) PropertyName(name string) string {
//     // Handle array notation like "metadata[]" and "file[]"
//     if strings.HasSuffix(name, "[]") {
//         baseName := strings.TrimSuffix(name, "[]")
//         return dashesAndOtherSeparatorsToKebabAndAddUnderscoreIfPurescriptKeyword(baseName) + "Array"
//     }
//
//     // Handle kebab-case from multipart field names
//     if strings.Contains(name, "-") {
//         return dashesAndOtherSeparatorsToKebabAndAddUnderscoreIfPurescriptKeyword(name)
//     }
//
//     return dashesAndOtherSeparatorsToKebabAndAddUnderscoreIfPurescriptKeyword(name)
// }
