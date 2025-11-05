/* eslint-disable import/no-anonymous-default-export */
/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
  overrides: [
    {
      customSyntax: 'postcss-less',
      files: ['*.less', '*.css'],
      plugins: ['stylelint-less'],
      rules: {
        'at-rule-no-unknown': null,
        'color-no-invalid-hex': true,
        'function-no-unknown': null,
        'less/color-no-invalid-hex': true,
      },
    },
    {
      customSyntax: 'postcss-styled-syntax',
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        // Disable rules that don't apply to CSS-in-JS
        'no-empty-source': null,
        'no-invalid-double-slash-comments': null,
        'nesting-selector-no-missing-scoping-root': null,
        // Vendor prefix rules
        'property-no-vendor-prefix': true,
        'value-no-vendor-prefix': [true, { ignoreValues: ['box'] }],
      },
    },
  ],
  plugins: ['stylelint-order', 'stylelint-use-logical-spec'],
  rules: {
    'liberty/use-logical-spec': [true, { except: ['float', /^((min|max)-)?(height|width)$/i] }],
  },
};
