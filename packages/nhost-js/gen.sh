#!/bin/sh

set -e

codegen gen \
    --openapi-file ./api/auth.yaml \
    --output-file ./src/auth/client.ts \
    --generator typescript

pnpm format ./src/auth/client.ts

codegen gen \
    --openapi-file ./api/storage.yaml \
    --output-file ./src/storage/client.ts \
    --generator typescript

pnpm format ./src/storage/client.ts

