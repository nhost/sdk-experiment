package format

import (
	"strings"
	"unicode"
)

// Capitalize the first letter of a string.
func Title(s string) string {
	if len(s) == 0 {
		return s // return empty string if input is empty
	}
	r := []rune(s)
	r[0] = unicode.ToUpper(r[0])
	return string(r)
}

func ToCamelCase(s string) string {
	splitFunc := func(r rune) bool {
		return r == ' ' || r == '-'
	}
	parts := strings.FieldsFunc(s, splitFunc)

	for i := range parts {
		parts[i] = Title(parts[i])
	}
	return strings.Join(parts, "")
}
