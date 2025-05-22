package gen

import "strings"

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
