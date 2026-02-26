#!/bin/sh
set -e

# find script dir and project root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# ensure output directories exist
mkdir -p "$ROOT/packages/nhost-js/src/auth"
mkdir -p "$ROOT/packages/nhost-js/src/storage"
mkdir -p "$ROOT/packages/purescript-nhost/src/Auth"
mkdir -p "$ROOT/packages/purescript-nhost/src/Storage"

# run generators
# go run main.go gen \
#     --openapi-file "$ROOT/packages/nhost-js/api/auth.yaml" \
#     --output-file "$ROOT/packages/nhost-js/src/auth/client.ts" \
#     --plugin typescript
#
# go run main.go gen \
#     --openapi-file "$ROOT/packages/nhost-js/api/storage.yaml" \
#     --output-file "$ROOT/packages/nhost-js/src/storage/client.ts" \
#     --plugin typescript

go run main.go gen \
    --openapi-file "$ROOT/packages/nhost-js/api/auth.yaml" \
    --output-file "$ROOT/packages/purescript-nhost/src/Auth/Client.purs" \
    --plugin purescript

go run main.go gen \
    --openapi-file "$ROOT/packages/nhost-js/api/storage.yaml" \
    --output-file "$ROOT/packages/purescript-nhost/src/Storage/Client.purs" \
    --plugin purescript

# format PureScript output
(
  cd "$ROOT/packages/purescript-nhost"
  purs-tidy format-in-place src
  purs-module-tidy src test
)

# run make with project root
make ROOT="$ROOT"
