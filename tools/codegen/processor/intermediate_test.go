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

func TestNewInterMediateRepresentation(t *testing.T) {
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

			ir, err := processor.NewInterMediateRepresentation(doc, nil)
			if err != nil {
				t.Fatalf("failed to create intermediate representation: %v", err)
			}

			if !assert.Len(t, ir.Types, 2, "expected 2 types") {
				t.FailNow()
			}

			firstType := ir.Types[0]
			assert.Equal(t, "SimpleObject", firstType.Name(),
				"expected first type name to be SimpleObject")
			assert.IsType(t, &processor.TypeObject{}, firstType,
				"expected first type to be of type TypeObject")
			firstObject, _ := firstType.(*processor.TypeObject)
			assert.Len(t, firstObject.Properties(), 11, "expected first type to have 11 properties")

			// Table-driven test for properties
			expectedProperties := []struct {
				name string
				typ  string
			}{
				{name: "id", typ: "string"},
				{name: "active", typ: "boolean"},
				{name: "age", typ: "number"},
				{name: "createdAt", typ: "string"},
				{name: "metadata", typ: "object"},
				{name: "data", typ: "string"},
				{name: "tags", typ: "array"},
				{name: "parent", typ: "SimpleObject"},
				{name: "children", typ: "array"},
				{name: "status", typ: "string"},
				{name: "nested", typ: "SimpleObjectNested"},
			}

			for i, exp := range expectedProperties {
				prop := firstObject.Properties()[i]
				assert.Equal(t, exp.name, prop.Name,
					"expected property %d name to be %s", i, exp.name)
				assert.Equal(t, firstObject, prop.Parent,
					"expected property %d parent to be first type", i)
				assert.Equal(t, exp.typ, prop.Type.Name(),
					"expected property %d type to be %s", i, exp.typ)
			}

			secondType := ir.Types[1]
			assert.Equal(t, "SimpleObjectNested", secondType.Name(),
				"expected second type name to be SimpleObjectNested")
			assert.IsType(
				t, &processor.TypeObject{}, secondType,
				"expected second type to be of type TypeObject",
			)
			secondObject, _ := secondType.(*processor.TypeObject)
			assert.Len(t, secondObject.Properties(), 2, "expected second type to have 2 properties")

			// Table-driven test for properties
			expectedProperties = []struct {
				name string
				typ  string
			}{
				{name: "nestedId", typ: "string"},
				{name: "nestedData", typ: "string"},
			}

			for i, exp := range expectedProperties {
				prop := secondObject.Properties()[i]
				assert.Equal(t, exp.name, prop.Name,
					"expected property %d name to be %s", i, exp.name)
				assert.Equal(t, secondObject, prop.Parent,
					"expected property %d parent to be first type", i)
				assert.Equal(t, exp.typ, prop.Type.Name(),
					"expected property %d type to be %s", i, exp.typ)
			}
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

			t.Log("\n", buf.String())
		})
	}
}
