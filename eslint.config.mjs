import pluginJs from '@eslint/js';
import esLintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  esLintConfigPrettier,
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true
          // allowVoid: true
        }
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variableLike', format: ['camelCase'] },
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require'
        },
        {
          selector: 'memberLike',
          modifiers: ['private', 'static'],
          format: ['UPPER_CASE'],
          leadingUnderscore: 'require'
        },
        {
          selector: 'method',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'forbid'
        }
      ],
      // allow no-namespace
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off'
    }
  }
];
