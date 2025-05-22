package gen

import (
	"context"
	"embed"
	"errors"
	"fmt"
	"os"
	"text/template"

	"github.com/pb33f/libopenapi"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/urfave/cli/v3"
)

const (
	openAPIFile = "../../packages/nhost-js/api/auth.yaml"
)

//go:embed templates/*.tmpl
var templateFS embed.FS

func Command() *cli.Command {
	return &cli.Command{ //nolint:exhaustruct
		Name:   "gen",
		Usage:  "generate code",
		Action: action,
	}
}

func getModel() (*libopenapi.DocumentModel[v3.Document], error) {
	// Read OpenAPI file
	b, err := os.ReadFile(openAPIFile)
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

func render(data any) error {
	// Load the interface template
	interfaceTemplateContent, err := templateFS.ReadFile("templates/typescript.tmpl")
	if err != nil {
		return fmt.Errorf("failed to read interface template: %w", err)
	}

	// Create a new template and register the ToCamelCase function
	interfaceTemplate, err := template.New("interface.ts.tmpl").Funcs(template.FuncMap{
		"ToCamelCase": ToCamelCase,
	}).Parse(string(interfaceTemplateContent))
	if err != nil {
		return fmt.Errorf("failed to parse interface template: %w", err)
	}

	// Execute the template
	if err := interfaceTemplate.Execute(os.Stdout, data); err != nil {
		return fmt.Errorf("failed to execute template: %w", err)
	}

	return nil
}

func action(_ context.Context, _ *cli.Command) error {
	docModel, err := getModel()
	if err != nil {
		return cli.Exit(fmt.Sprintf("failed to load model: %v", err), 1)
	}

	wrappedSchema := Schema{
		Types:   make([]*Type, 0, 100),   //nolint:mnd
		Methods: make([]*Method, 0, 100), //nolint:mnd
	}

	typescriptProcessor := &TypescriptProcessor{}

	// Process each schema
	for schemaPairs := docModel.Model.Components.Schemas.First(); schemaPairs != nil; schemaPairs = schemaPairs.Next() {
		schemaName := schemaPairs.Key()
		proxy := schemaPairs.Value()

		if proxy.Schema() != nil && len(proxy.Schema().Type) > 0 {
			data, err := processObject(schemaName, proxy, typescriptProcessor)
			if err != nil {
				return cli.Exit(fmt.Sprintf("failed to process object schema %s: %v", schemaName, err), 1)
			}

			wrappedSchema.Types = append(wrappedSchema.Types, data...)
		} else {
			return cli.Exit(fmt.Sprintf("schema %s is not an object", schemaName), 1)
		}
	}

	for schemaPairs := docModel.Model.Paths.PathItems.First(); schemaPairs != nil; schemaPairs = schemaPairs.Next() {
		path := schemaPairs.Key()

		methods, types, err := processPathItem(path, schemaPairs.Value(), typescriptProcessor)
		if err != nil {
			return cli.Exit(fmt.Sprintf("%s: failed to process path item: %w", path, err), 1)
		}

		wrappedSchema.Methods = append(wrappedSchema.Methods, methods...)
		wrappedSchema.Types = append(wrappedSchema.Types, types...)
	}

	if err := render(wrappedSchema); err != nil {
		return cli.Exit(fmt.Sprintf("failed to render template: %v", err), 1)
	}

	return nil
}
