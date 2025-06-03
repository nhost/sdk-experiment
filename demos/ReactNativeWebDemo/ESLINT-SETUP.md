# Enhanced ESLint Setup for React Native Web Demo

This document explains how the ESLint configuration has been enhanced to provide strict type checking and code quality rules similar to those in the React demo.

## Overview

The ESLint configuration (`eslint.config.js`) has been enhanced to:

1. Maintain Expo's base ESLint configuration
2. Add TypeScript ESLint's strict type checking
3. Include React-specific rules and best practices
4. Catch potential issues as early as possible in development

## Installation

To use the enhanced ESLint configuration, you need to install the required dependencies:

```bash
# Run the provided script to install all necessary dependencies
node ./scripts/install-eslint-deps.js

# Alternatively, install dependencies manually
pnpm add -D typescript-eslint globals eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-react @eslint/js
```

## Configuration Details

The enhanced configuration includes:

- **Basic ESLint recommended rules**: Catches common JavaScript errors and questionable patterns
- **TypeScript ESLint strict checking**: Enforces type safety across your codebase
- **React-specific rules**: Ensures proper usage of React hooks, JSX, and component patterns
- **Stylistic rules**: Maintains consistent code style

## Running ESLint

You can run ESLint using the following npm script:

```bash
# Run ESLint
pnpm test:lint

# Fix automatically fixable issues
pnpm test:lint -- --fix
```

## Configuration Structure

The configuration is organized in several layers:

1. **Base ESLint rules**: Basic JavaScript linting
2. **TypeScript strict rules**: Advanced type checking
3. **Expo config**: React Native and Expo specific rules
4. **React-specific rules**: React hooks and component patterns

## Benefits of Strict ESLint Configuration

- Catches type errors before runtime
- Enforces consistent code style
- Prevents common React errors (like hooks rules violations)
- Improves code quality and maintainability
- Aligns with best practices for React and TypeScript development

## Comparison with React Demo

This configuration is designed to match the strictness level of the React demo while maintaining compatibility with React Native and Expo. It includes the same core TypeScript ESLint rules and React-specific plugins.
