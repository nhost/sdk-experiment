#!/bin/sh
set -e

# find script dir and project root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# ensure output directories exist
mkdir -p "$ROOT/packages/nhost-js/src/auth"
mkdir -p "$ROOT/packages/nhost-js/src/storage"
mkdir -p "$ROOT/packages/purescript-nhost/src/Nhost/Auth"
mkdir -p "$ROOT/packages/purescript-nhost/src/Nhost/Storage"

# run generators
# go run "$SCRIPT_DIR/main.go" gen \
#     --openapi-file "$ROOT/packages/nhost-js/api/auth.yaml" \
#     --output-file "$ROOT/packages/nhost-js/src/auth/client.ts" \
#     --plugin typescript
#
# go run "$SCRIPT_DIR/main.go" gen \
#     --openapi-file "$ROOT/packages/nhost-js/api/storage.yaml" \
#     --output-file "$ROOT/packages/nhost-js/src/storage/client.ts" \
#     --plugin typescript

go run "$SCRIPT_DIR/main.go" gen \
    --openapi-file "$ROOT/packages/nhost-js/api/auth.yaml" \
    --output-file "$ROOT/packages/purescript-nhost/src/Nhost/Auth/Client.purs" \
    --plugin purescript

go run "$SCRIPT_DIR/main.go" gen \
    --openapi-file "$ROOT/packages/nhost-js/api/storage.yaml" \
    --output-file "$ROOT/packages/purescript-nhost/src/Nhost/Storage/Client.purs" \
    --plugin purescript

sed -i'' -e '/import Web.File.Blob/d' \
        "$ROOT/packages/purescript-nhost/src/Nhost/Auth/Client.purs"

# format PureScript output
(
  cd "$ROOT/packages/purescript-nhost"
  purs-tidy format-in-place src
  purs-module-tidy src test

  # Remove trailing whitespaces from all .purs files in src and test directories
  # The -i '' is for macOS/BSD compatibility; for GNU/Linux, -i is sufficient.
  find src test -name "*.purs" -exec sed -i'' -e 's/[ \t]*$//' {} +
)

# run make with project root
make ROOT="$ROOT"
