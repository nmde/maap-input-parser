const config = require('nmde-common/config/eslint');
const { merge } = require('webpack-merge');

module.exports = merge(
  config,
  {
    extends: ['plugin:vue/vue3-recommended'],
    plugins: ['vue'],
    parser: 'vue-eslint-parser',
    parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: '@typescript-eslint/parser',
    },
  },
);
