// eslint-disable-next-line import/no-anonymous-default-export
export default {
  $schema: 'https://json.schemastore.org/prettierrc',
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  jsonRecursiveSort: false,
  jsonSortOrder: JSON.stringify({ [/.*/]: 'lexical' }),
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'preserve',
      },
    },
  ],
  plugins: [
    'prettier-plugin-sh',
    'prettier-plugin-organize-imports',
    'prettier-plugin-packagejson',
    'prettier-plugin-sort-json',
    '@trivago/prettier-plugin-sort-imports',
  ],
  printWidth: 100,
  proseWrap: 'never',
  quoteProps: 'consistent',
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
};
