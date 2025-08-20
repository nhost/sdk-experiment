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

// Purescript record field names should be camelCase
func recordFieldName(name string) string {
    // Convert kebab-case or snake_case to camelCase
    parts := strings.FieldsFunc(name, func(r rune) bool {
        return r == '-' || r == '_'
    })

    if len(parts) == 0 {
        parts = []string{name}
    }

    result := strings.ToLower(parts[0])
    for i := 1; i < len(parts); i++ {
        if len(parts[i]) > 0 {
            result += strings.ToUpper(string(parts[i][0])) + strings.ToLower(parts[i][1:])
        }
    }

    // Reserved PureScript keywords
    reserved := map[string]bool{
        "type": true, "module": true, "case": true, "class": true,
        "data": true, "newtype": true, "instance": true, "let": true,
        "in": true, "where": true, "do": true, "if": true, "then": true,
        "else": true, "foreign": true, "import": true, "as": true,
        "infix": true, "infixl": true, "infixr": true,
    }

    if reserved[result] {
        result += "_" // append underscore if reserved
    }

    return result
}

// Purescript type names should be PascalCase
func typeName(name string) string {
	return format.ToCamelCase(name)
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

func needsParentheses(typeName string) bool {
	// Only wrap in parentheses if it's a complex type (contains spaces)
	return strings.Contains(typeName, " ")
}

func hasValidDescription(description string) bool {
	if description == "" {
		return false
	}
	// Trim whitespace and check if it's just empty or placeholder
	trimmed := strings.TrimSpace(description)
	return trimmed != "" && trimmed != "-"
}

func (p *Purescript) GetFuncMap() map[string]any {
	return map[string]any{
		"recordFieldName": recordFieldName,
		"typeName":        typeName,
		"lowerFirst":      lowerFirst,
		"needsParentheses":    needsParentheses,
		"hasValidDescription": hasValidDescription,
	}
}

func (p *Purescript) TypeObjectName(name string) string {
	return typeName(name)
}

func (p *Purescript) TypeScalarName(scalar *processor.TypeScalar) string {
	switch scalar.Schema().Schema().Type[0] {
	case "integer":
		return "Int"
	case "number":
		return "Number"
	case "string":
		if scalar.Schema().Schema().Format == "binary" {
			return "Blob" // We'll need to import this from a web API module
		}
		return "String"
	case "boolean":
		return "Boolean"
	case "null":
		return "Unit"
	}

	return "String" // Default fallback
}

func (p *Purescript) TypeArrayName(array *processor.TypeArray) string {
	return "Array " + array.Item.Name()
}

func (p *Purescript) TypeEnumName(name string) string {
	return typeName(name)
}

func (p *Purescript) TypeEnumValues(values []any) []string {
	enumValues := make([]string, len(values))
	if len(values) == 0 {
		return enumValues
	}

	for i, v := range values {
		if s, ok := v.(string); ok {
			// Purescript ADT constructors should be PascalCase
			enumValues[i] = typeName(s)
		} else {
			// For non-string values, we'll create a constructor name
			enumValues[i] = fmt.Sprintf("Value%v", v)
		}
	}

	return enumValues
}

func (p *Purescript) TypeMapName(schema *processor.TypeMap) string {
	if v, ok := schema.Schema().Schema().Extensions.Get(extCustomType); ok {
		return v.Value
	}

	return "Object" // Purescript's generic object type
}

func (p *Purescript) MethodName(name string) string {
	return format.AntiTitle(format.ToCamelCase(name))
}

func (p *Purescript) MethodPath(name string) string {
	return strings.ReplaceAll(name, "{", "${")
}

func (p *Purescript) ParameterName(name string) string {
	return recordFieldName(name)
}

func (p *Purescript) BinaryType() string {
	return "Blob"
}

func (p *Purescript) IsMultipartRequest(method *processor.Method) bool {
    for contentType := range method.Bodies {
        if strings.Contains(contentType, "multipart/form-data") {
            return true
        }
    }
    return false
}

// Modified property name to handle array fields correctly
func (p *Purescript) PropertyName(name string) string {
    // Handle array notation like "metadata[]" and "file[]"
    if strings.HasSuffix(name, "[]") {
        baseName := strings.TrimSuffix(name, "[]")
        return recordFieldName(baseName) + "Array"
    }

    // Handle kebab-case from multipart field names
    if strings.Contains(name, "-") {
        return recordFieldName(name)
    }

    return recordFieldName(name)
}

// Add method to generate proper field names for JSON encoding
func (p *Purescript) JSONFieldName(originalName string) string {
    // For multipart fields, preserve the original structure
    if strings.Contains(originalName, "-") || strings.Contains(originalName, "[]") {
        return originalName
    }
    return originalName
}
