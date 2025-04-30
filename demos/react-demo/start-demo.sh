#!/bin/bash

# Build the SDK
cd ../../
pnpm build

# Return to the demo directory
cd demos/react-demo

# Install dependencies if needed
pnpm install

# Start the development server
pnpm dev 