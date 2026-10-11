// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  root: true,
  extends: ['expo'],
  ignorePatterns: ['/dist/*', 'node_modules', 'babel.config.js', 'metro.config.js'],
  rules: {
    'import/order': 'off',
  },
};
