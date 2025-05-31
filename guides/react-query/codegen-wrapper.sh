#!/bin/bash
# due to bug https://github.com/dotansimha/graphql-code-generator-community/issues/824

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running GraphQL code generator..."
# Run the original codegen command
pnpm graphql-codegen --config codegen.ts

# Path to the generated file
GENERATED_FILE="src/lib/graphql/__generated__/graphql.ts"

echo "Fixing import in $GENERATED_FILE..."
if [ -f "$GENERATED_FILE" ]; then
  sed -i -e 's/import type { useAuthenticatedFetcher }/import { useAuthenticatedFetcher }/g' "$GENERATED_FILE"
  echo "Successfully removed \"type\" from useAuthenticatedFetcher import."
else
  echo "Error: Generated file not found at $GENERATED_FILE"
  exit 1
fi

echo "All tasks completed successfully."
