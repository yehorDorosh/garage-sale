module.exports = {
  customSyntax: 'postcss-html',
  extends: [
    'stylelint-config-standard',
    // 'stylelint-config-recommended-vue'
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'selector-class-pattern': '',
    'value-keyword-case': [
      'lower',
      {
        ignoreKeywords: ['imageWidth', 'imageHeight', 'imageAmount']
      }
    ],
  },
  env: {
    browser: true,
  },
};
