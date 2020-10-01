module.exports = {
  root: true,
  extends: [
    'airbnb/hooks',
    'airbnb',
    // 'plugin:react/recommended',
    // 'plugin:react-native/all',
    // '@react-native-community'
  ],
  plugins: ['import', 'react', 'react-native'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 0,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jquery: false,
    jest: true,
  },
};
