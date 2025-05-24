package processor_test

import (
	"bytes"
	"errors"
	"fmt"
	"os"
	"testing"

	"github.com/nhost/sdk-experiment/tools/codegen/processor"
	"github.com/nhost/sdk-experiment/tools/codegen/processor/typescript"
	"github.com/pb33f/libopenapi"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/stretchr/testify/assert"
)

type ExpectedProperty struct {
	Name string
	Type string
}

type ExpectedType struct {
	Name       string
	TypeKind   processor.TypeIdentifier // "object", "scalar", "array", "enum"
	Properties []ExpectedProperty
	EnumValues []string
}

type ExpectedIR struct {
	Types []ExpectedType
}

func AssertIR(t *testing.T, actual *processor.InterMediateRepresentation, expected ExpectedIR) {
	t.Helper()

	assert.Len(t, actual.Types, len(expected.Types), "expected %d types", len(expected.Types))

	for i, expType := range expected.Types {
		if i >= len(actual.Types) {
			t.Fatalf("expected type at index %d not found", i)
			return
		}

		actType := actual.Types[i]
		assert.Equal(t, expType.Name, actType.Name(),
			"expected type %d name to be %s", i, expType.Name)
		assert.Equal(t, expType.TypeKind, actType.Type(),
			"expected type %d kind to be %s", i, expType.TypeKind)

		switch actType.Type() { //nolint:exhaustive
		case processor.TypeIdentifierObject:
			g, ok := actType.(*processor.TypeObject)
			if !ok {
				t.Fatalf("expected type %d to be of kind object", i)
			}

			assert.Len(t, g.Properties(), len(expType.Properties),
				"expected %d properties for type %s", len(expType.Properties), actType.Name())

			for j, gProp := range g.Properties() {
				assert.Equal(t, expType.Properties[j].Name, gProp.Name,
					"expected property %d name to be %s", j, expType.Properties[j].Name)
				assert.Equal(t, expType.Properties[j].Type, gProp.Type.Name(),
					"expected property %d type to be %s", j, gProp.Type.Name())

				assert.Same(t, actType, gProp.Parent,
					"expected property %d parent to be the same as type %s", j, actType.Name())
			}
		case processor.TypeIdentifierEnum:
			g, ok := actType.(*processor.TypeEnum)
			if !ok {
				t.Fatalf("expected type %d to be of kind enum", i)
			}

			assert.Len(t, g.Values(), len(expType.EnumValues),
				"expected %d enum values for type %s", len(expType.EnumValues), actType.Name())

			assert.Equal(t, expType.EnumValues, g.Values(),
				"expected enum values for type %s to match", actType.Name())
		default:
			t.Fatalf("unexpected type kind %s for type %s", actType.Type(), actType.Name())
		}
	}
}

func getModel(filepath string) (*libopenapi.DocumentModel[v3.Document], error) {
	// Read OpenAPI file
	b, err := os.ReadFile(filepath)
	if err != nil {
		return nil, fmt.Errorf("failed to read openapi spec: %w", err)
	}

	document, err := libopenapi.NewDocument(b)
	if err != nil {
		return nil, fmt.Errorf("cannot create new document: %w", err)
	}

	docModel, errorsList := document.BuildV3Model()
	if len(errorsList) > 0 {
		var wrappedError error
		for i := range errorsList {
			wrappedError = errors.Join(wrappedError, errorsList[i])
		}
		return nil, fmt.Errorf("cannot create v3 model from document: %w", wrappedError)
	}

	return docModel, nil
}

type testPlugin struct{}

func (t *testPlugin) GetTemplate() string {
	return ""
}

func (t *testPlugin) TypeObjectName(name string) string {
	return name
}

func (t *testPlugin) TypeScalarName(scalar *processor.TypeScalar) string {
	return scalar.Schema().Schema().Type[0]
}

func (t *testPlugin) TypeArrayName(array *processor.TypeArray) string {
	return array.Item.Name() + "[]"
}

func (t *testPlugin) TypeEnumName(name string) string {
	return "Enum" + name
}

func (t *testPlugin) TypeMapName(_ *processor.TypeMap) string {
	return "Record<string, unknown>"
}

func (t *testPlugin) TypeEnumValues(values []any) []string {
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

func TestNewInterMediateRepresentation(t *testing.T) {
	t.Parallel()

	cases := []struct {
		name     string
		expected ExpectedIR
	}{
		{
			name: "simple.yaml",
			expected: ExpectedIR{
				Types: []ExpectedType{
					{
						Name:     "SimpleObject",
						TypeKind: processor.TypeIdentifierObject,
						Properties: []ExpectedProperty{
							{Name: "id", Type: "string"},
							{Name: "active", Type: "boolean"},
							{Name: "age", Type: "number"},
							{Name: "createdAt", Type: "string"},
							{Name: "metadata", Type: "Record<string, unknown>"},
							{Name: "data", Type: "string"},
							{Name: "tags", Type: "string[]"},
							{Name: "parent", Type: "SimpleObject"},
							{Name: "children", Type: "SimpleObject[]"},
							{Name: "status", Type: "EnumSimpleObjectStatus"},
							{Name: "statusCode", Type: "EnumSimpleObjectStatusCode"},
							{Name: "statusMixed", Type: "EnumSimpleObjectStatusMixed"},
							{Name: "nested", Type: "SimpleObjectNested"},
						},
						EnumValues: nil,
					},
					{
						Name:       "EnumSimpleObjectStatus",
						TypeKind:   processor.TypeIdentifierEnum,
						Properties: nil,
						EnumValues: []string{"\"active\"", "\"inactive\"", "\"pending\""},
					},
					{
						Name:       "EnumSimpleObjectStatusCode",
						TypeKind:   processor.TypeIdentifierEnum,
						Properties: nil,
						EnumValues: []string{"0", "1", "2"},
					},
					{
						Name:       "EnumSimpleObjectStatusMixed",
						TypeKind:   processor.TypeIdentifierEnum,
						Properties: nil,
						EnumValues: []string{"0", "\"One\"", "true"},
					},
					{
						Name:     "SimpleObjectNested",
						TypeKind: processor.TypeIdentifierObject,
						Properties: []ExpectedProperty{
							{Name: "nestedId", Type: "string"},
							{Name: "nestedData", Type: "string"},
						},
						EnumValues: nil,
					},
					// You can add the remaining 3 types here as needed
				},
			},
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()

			doc, err := getModel("testdata/" + tc.name)
			if err != nil {
				t.Fatalf("failed to get model: %v", err)
			}

			ir, err := processor.NewInterMediateRepresentation(doc, &testPlugin{})
			if err != nil {
				t.Fatalf("failed to create intermediate representation: %v", err)
			}

			// Assert the IR matches our expectations
			AssertIR(t, ir, tc.expected)
		})
	}
}

func TestInterMediateRepresentationRender(t *testing.T) {
	t.Parallel()

	cases := []struct {
		name string
	}{
		{
			name: "simple.yaml",
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()

			doc, err := getModel("testdata/" + tc.name)
			if err != nil {
				t.Fatalf("failed to get model: %v", err)
			}

			ir, err := processor.NewInterMediateRepresentation(doc, &typescript.Typescript{})
			if err != nil {
				t.Fatalf("failed to create intermediate representation: %v", err)
			}

			buf := bytes.NewBuffer(nil)
			if err := ir.Render(buf); err != nil {
				t.Fatalf("failed to render intermediate representation: %v", err)
			}

			output := buf.String()

			b, err := os.ReadFile("testdata/" + tc.name + ".ts")
			if err != nil {
				t.Fatalf("failed to read expected output file: %v", err)
			}

			assert.Equal(t, string(b), output,
				"rendered output does not match expected output for %s", tc.name)
		})
	}
}
