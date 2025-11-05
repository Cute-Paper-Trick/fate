import pluginJs from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

const eslintConfig = defineConfig([
  pluginJs.configs.recommended,
  ...nextTs,
  // umi
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: {
      // 不需要返回就用 forEach
      'array-callback-return': 2,
      // eqeq 可能导致潜在的类型转换问题
      'eqeqeq': 2,
      'for-direction': 2,
      // 不加 hasOwnProperty 判断会多出原型链的内容
      'guard-for-in': 2,
      'no-async-promise-executor': 2,
      'no-case-declarations': 2,
      'no-debugger': 2,
      'no-delete-var': 2,
      'no-dupe-else-if': 2,
      'no-duplicate-case': 2,
      // eval（）可能导致潜在的安全问题
      'no-eval': 2,
      'no-ex-assign': 2,
      'no-global-assign': 2,
      'no-invalid-regexp': 2,
      // 没必要改 native 变量
      'no-native-reassign': 2,
      // 修改对象时，会影响原对象；但是有些场景就是有目的
      'no-param-reassign': 2,
      // return 值无意义，可能会理解为 resolve
      'no-promise-executor-return': 2,
      'no-self-assign': 2,
      'no-self-compare': 2,
      'no-shadow-restricted-names': 2,
      'no-sparse-arrays': 2,
      'no-unsafe-finally': 2,
      'no-unused-labels': 2,
      'no-useless-catch': 2,
      'no-useless-escape': 2,
      'no-var': 2,
      'no-with': 2,
      'require-yield': 2,
      'use-isnan': 2,

      // config-plugin-react rules
      // button 自带 submit 属性
      'react/button-has-type': 2,
      'react/jsx-key': 2,
      'react/jsx-no-comment-textnodes': 2,
      'react/jsx-no-duplicate-props': 2,
      'react/jsx-no-target-blank': 2,
      'react/jsx-no-undef': 2,
      'react/jsx-uses-react': 2,
      'react/jsx-uses-vars': 2,
      'react/no-children-prop': 2,
      'react/no-danger-with-children': 2,
      'react/no-deprecated': 2,
      'react/no-direct-mutation-state': 2,
      'react/no-find-dom-node': 2,
      'react/no-is-mounted': 2,
      'react/no-string-refs': 2,
      'react/no-render-return-value': 2,
      'react/no-unescaped-entities': 2,
      'react/no-unknown-property': 2,
      'react/require-render-return': 2,

      // config-plugin-react-hooks rules
      'react-hooks/rules-of-hooks': 2,

      '@typescript-eslint/no-confusing-non-null-assertion': 2,
      '@typescript-eslint/no-dupe-class-members': 2,
      '@typescript-eslint/no-empty-interface': 2,
      '@typescript-eslint/no-invalid-this': 2,
      '@typescript-eslint/no-loop-func': 2,
      '@typescript-eslint/no-misused-new': 2,
      '@typescript-eslint/no-namespace': 2,
      '@typescript-eslint/no-non-null-asserted-optional-chain': 2,
      '@typescript-eslint/no-redeclare': 2,
      '@typescript-eslint/no-this-alias': 2,
      '@typescript-eslint/no-unused-expressions': 2,
      '@typescript-eslint/no-unused-vars': 2,
      '@typescript-eslint/no-use-before-define': 2,
      '@typescript-eslint/no-useless-constructor': 2,
      '@typescript-eslint/triple-slash-reference': 2,
    },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': [
        'warn',
        {
          type: 'natural',
          order: 'asc',
        },
      ],
    },
  },
  ...nextVitals,
  {
    // ...importPlugin.flatConfigs.recommended,
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: {
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  },
  eslintConfigPrettier,
  // Unused imports plugin
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: {
      // use perfectionist/sort-imports instead
      // "sort-imports": [
      //   "warn",
      //   {
      //     "ignoreCase": false,
      //     "ignoreDeclarationSort": false,
      //     "ignoreMemberSort": false,
      //     "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
      //     "allowSeparatedGroups": false
      //   }
      // ],
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-explicit-any': 0,

      'no-empty': 'warn',
      'no-extra-boolean-cast': 0,
      'no-unused-vars': 0,
      'react/display-name': 0,
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-sort-props': 'warn',
      'react/no-unknown-property': 'warn',
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 0,
      'react/self-closing-comp': [
        'warn',
        {
          component: true,
          html: true,
        },
      ],
    },
  },
  // Unicorn plugin configuration
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      ...eslintPluginUnicorn.configs.recommended.rules,
      // Custom unicorn rule overrides
      'unicorn/catch-error-name': 'warn',
      'unicorn/explicit-length-check': 0,
      'unicorn/filename-case': 0,
      'unicorn/import-style': 0,
      'unicorn/no-anonymous-default-export': 0,
      'unicorn/no-array-callback-reference': 0,
      'unicorn/no-array-for-each': 0,
      'unicorn/no-array-reduce': 0,
      'unicorn/no-empty-file': 'warn',
      'unicorn/no-negated-condition': 0,
      'unicorn/no-nested-ternary': 0,
      'unicorn/no-null': 0,
      'unicorn/no-typeof-undefined': 'warn',
      'unicorn/no-useless-undefined': 0,
      'unicorn/prefer-code-point': 0,
      'unicorn/prefer-logical-operator-over-ternary': 0,
      'unicorn/prefer-module': 0,
      'unicorn/prefer-number-properties': 0,
      'unicorn/prefer-query-selector': 0,
      'unicorn/prefer-spread': 0,
      'unicorn/prefer-string-raw': 0,
      'unicorn/prefer-string-replace-all': 'warn',
      'unicorn/prefer-ternary': 0,
      'unicorn/prefer-type-error': 0,
      'unicorn/prevent-abbreviations': 0,
      'unicorn/switch-case-braces': 'warn',
    },
  },
  // Additional general rules
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: {
      'no-extra-boolean-cast': 0,
    },
  },
  // Specific file overrides
  {
    files: ['src/types/generation/**/*'],
    rules: {
      '@typescript-eslint/no-empty-interface': 0,
      'sort-keys-fix/sort-keys-fix': 0,
      'typescript-sort-keys/interface': 0,
      'typescript-sort-keys/string-enum': 0,
    },
  },
  // Generated files - less strict rules
  {
    files: ['src/lib/openapi/**/*', '**/*.generated.*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/ban-types': 0,
      'unicorn/filename-case': 0,
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    'drizzle/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/lib/openapi/*',
    '**/*.generated.*',
  ]),
]);

export default eslintConfig;
