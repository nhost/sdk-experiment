import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import { vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylistic,
  {
    // Vue demo specific ignores
    ignores: [
      'dist',
      'dist-ssr',
      'build',
      'node_modules',
      '.vite',
      'coverage',
      'vite.config.ts',
      'eslint.config.mjs',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{ts,mts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      // Vue recommended rules
      ...pluginVue.configs['flat/essential'].rules,
      ...pluginVue.configs['flat/strongly-recommended'].rules,
      ...pluginVue.configs['flat/recommended'].rules,

      // TypeScript rules adapted for Vue
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      // Disable floating promises rule for better Vue composition API experience
      '@typescript-eslint/no-floating-promises': 'off',

      // Vue-specific TypeScript adjustments
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  // Include Vue TypeScript configurations
  ...vueTsConfigs.recommended,
  // Skip formatting rules (handled by Prettier)
  skipFormatting,
)
