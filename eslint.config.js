import eslint from '@eslint/js';
import pluginJest from 'eslint-plugin-jest';
import perfectionist from 'eslint-plugin-perfectionist';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    ignores: ['**/*.js'],
  },

  {
    plugins: {
      perfectionist,
    },

    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      'no-console': 'error',
    },
  },
];
