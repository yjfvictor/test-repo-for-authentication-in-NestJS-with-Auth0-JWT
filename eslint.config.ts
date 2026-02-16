/**
 * @file eslint.config.ts
 * @brief ESLint flat configuration for the NestJS Auth0 JWT project.
 * @details Configures TypeScript parsing and recommended rules for the
 * codebase. Uses the flat config format (ESLint 9+). Applies to all .ts
 * files under src, test, and config files. Explicit type declarations
 * and Doxygen comments are encouraged; no rule removal for comments.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * @var config
 * @type Array<object>
 * @brief Flat config array exported as default.
 * @details Spreads eslint.configs.recommended and typescript-eslint recommended
 * so that TypeScript and ESLint rules apply. Extends to project root.
 */
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        node: true,
        jest: true,
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
