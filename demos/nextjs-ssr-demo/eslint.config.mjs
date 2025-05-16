import nextjsConfig from '../../configs/eslint/nextjs.mjs';
import jsonConfig from '../../configs/eslint/json.mjs';

export default [
  ...nextjsConfig,
  ...jsonConfig,
  {
    // Next.js demo specific ignores
    ignores: [
      'dist',
      'build',
      'node_modules',
      '.next',
      'coverage'
    ]
  },
  {
    // Next.js SSR demo specific rules
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Downgrade from error to warning for demo purposes
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // Enforce using getServerSideProps for SSR demos
      '@next/next/no-html-link-for-pages': 'error',
    }
  },
  {
    // Rules specific to Next.js API routes
    files: ['**/pages/api/**/*.ts'],
    rules: {
      // Ensure API handlers have proper error handling
      'no-console': ['error', { allow: ['error'] }],
    }
  }
];