package purescript

import (
	"fmt"
	"strings"
	"unicode"

	"github.com/nhost/sdk-experiment/tools/codegen/format"
	"github.com/nhost/sdk-experiment/tools/codegen/processor"
)

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

func lowerFirst(s string) string {
	if len(s) == 0 {
		return s
	}
	r := []rune(s)
	r[0] = unicode.ToLower(r[0])
	return string(r)
}

func containsSpaceInside(typeName string) bool {
	return strings.Contains(typeName, " ")
}

// Helper to check if comment/description is empty or meaningless
func hasValidDescription(description string) bool {
	trimmed := strings.TrimSpace(description)
	return trimmed != "" && trimmed != "-" && trimmed != "nil"
}

func splitLines(s string) []string {
	return strings.Split(s, "\n")
}

func quote(s string) string {
	return `"` + s + `"`
}

func anyPropertyIsBlob(props []*processor.Property) bool {
	for _, p := range props {
		if p.Type.Name() == "Blob" || p.Type.Name() == "Array Blob" {
			return true
		}
	}
	return false
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
