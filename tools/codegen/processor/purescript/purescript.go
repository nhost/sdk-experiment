package purescript

import (
	"embed"
	"fmt"
	"io/fs"
	"strings"
	"unicode"

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

func isPurescriptKeyword(name string) bool {
	reserved := map[string]struct{}{
		"type": {}, "module": {}, "case": {}, "class": {},
		"data": {}, "newtype": {}, "instance": {}, "let": {},
		"in": {}, "where": {}, "do": {}, "if": {}, "then": {},
		"else": {}, "foreign": {}, "import": {}, "as": {},
		"infix": {}, "infixl": {}, "infixr": {},
	}
	_, ok := reserved[name]
	return ok
}

func addUnderscoreIfPurescriptKeyword(name string) string {
	if isPurescriptKeyword(name) {
		return name + "_"
	}
	return name
}

// Examples:
//   dashesAndOtherSeparatorsToKebabAndAddUnderscoreIfPurescriptKeyword("user_id")        // => "userId"
//   dashesAndOtherSeparatorsToKebabAndAddUnderscoreIfPurescriptKeyword("user-name")      // => "userName"
//   dashesAndOtherSeparatorsToKebabAndAddUnderscoreIfPurescriptKeyword("User_Name")      // => "userName"
//   dashesAndOtherSeparatorsToKebabAndAddUnderscoreIfPurescriptKeyword("type")           // => "type_"
//   dashesAndOtherSeparatorsToKebabAndAddUnderscoreIfPurescriptKeyword("content-length") // => "contentLength"
//   dashesAndOtherSeparatorsToKebabAndAddUnderscoreIfPurescriptKeyword("X-API_KEY")      // => "xApiKey"
//   dashesAndOtherSeparatorsToKebabAndAddUnderscoreIfPurescriptKeyword("")               // => "" (fallback to input)
func dashesAndOtherSeparatorsToKebabAndAddUnderscoreIfPurescriptKeyword(name string) string {
	return addUnderscoreIfPurescriptKeyword(format.ToCamelCase(name))
}

// Convert to lowercase with first letter
func lowerFirst(s string) string {
	if len(s) == 0 {
		return s
	}
	r := []rune(s)
	r[0] = unicode.ToLower(r[0])
	return string(r)
}

// Helper to check if type needs parentheses
func containsSpaceInside(typeName string) bool {
	return strings.Contains(typeName, " ")
}

// Helper to check if comment/description is empty or meaningless
func hasValidDescription(description string) bool {
	if description == "" {
		return false
	}
	trimmed := strings.TrimSpace(description)
	return trimmed != "" && trimmed != "-" && trimmed != "nil"
}

// Check if string has prefix
func hasPrefix(s, prefix string) bool {
	return strings.HasPrefix(s, prefix)
}

// Convert enum value (from API) to PureScript constructor name
func enumValueToConstructor(value interface{}) string {
	if s, ok := value.(string); ok {
		// Convert kebab-case, snake_case, or camelCase to PascalCase
		return format.ToCamelCase(s)
	}
	return fmt.Sprintf("Value%v", value)
}

// Convert enum value to JSON string representation
func enumValueToJsonString(value interface{}) string {
	if s, ok := value.(string); ok {
		return fmt.Sprintf("\"%s\"", s)
	}
	return fmt.Sprintf("\"%v\"", value)
}

// Map Go/OpenAPI types to PureScript codec functions
func getCodecForScalarType(scalarType string, format string) string {
	switch scalarType {
	case "integer":
		return "CJ.int"
	case "number":
		return "CJ.number"
	case "string":
		if format == "binary" {
			return "CJ.string" // Blob as base64 string in JSON
		}
		return "CJ.string"
	case "boolean":
		return "CJ.boolean"
	case "null":
		return "CJ.null"
	default:
		return "CJ.string" // fallback
	}
}

// Map Go/OpenAPI types to PureScript codec functions
func splitLines(s string) []string {
	return strings.Split(s, "\n")
}

func quote(s string) string {
	return fmt.Sprintf("%q", s)
}

func anyPropertyIsBlob(props []*processor.Property) bool {
    for _, p := range props {
        if p.Type.Name() == "Blob" || p.Type.Name() == "Array Blob" {
            return true
        }
    }
    return false
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
		"hasPrefix":              hasPrefix,
		"getCodecForScalarType":  getCodecForScalarType,
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
  // Preserve exact name, including array notation
  // return fmt.Sprintf(%q, name) // wrap in quotes
  return name // wrap in quotes
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
