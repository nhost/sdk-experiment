package gen

import (
	"context"
	"fmt"

	"github.com/urfave/cli/v3"
)

const (
	flagOpenAPIFile = "openapi-file"
	flagOutputFile  = "output-file"
	flagGenerator   = "generator"
)

func Command() *cli.Command {
	return &cli.Command{ //nolint:exhaustruct
		Name:   "gen",
		Usage:  "generate code",
		Action: action,
		Flags: []cli.Flag{
			&cli.StringFlag{ //nolint:exhaustruct
				Name:     flagOpenAPIFile,
				Usage:    "OpenAPI file to process",
				Required: true,
				Sources:  cli.EnvVars("OPENAPI_FILE"),
			},
			&cli.StringFlag{ //nolint:exhaustruct
				Name:     flagOutputFile,
				Usage:    "Output file to write to",
				Required: true,
				Sources:  cli.EnvVars("OUTPUT_FILE"),
			},
			&cli.StringFlag{ //nolint:exhaustruct
				Name:     flagGenerator,
				Usage:    "Generator to use",
				Required: true,
				Sources:  cli.EnvVars("GENERATOR"),
			},
		},
	}
}

func action(_ context.Context, _ *cli.Command) error {
	fmt.Println("Starting code generation...") //nolint:forbidigo
	return nil
}
