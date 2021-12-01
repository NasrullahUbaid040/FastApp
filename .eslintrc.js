module.exports = {
  env: {
    browser: true,
    es2021: true,
    'react-native/react-native': true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'prettier',
    'react-native',
  ],
  rules: {
    semi: [2, 'never'],
    'arrow-body-style': 0,
    'max-len': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 2,
    'react-native/no-color-literals': 2,
    // 'react-native/no-raw-text': 2,
    'react-native/no-single-element-style-arrays': 2,
    'no-use-before-define': ['error', { functions: true, classes: true, variables: false }], // disable the rule for variables, but enable it for functions and classes
    'linebreak-style': 0,
    'react/prop-types': 0,
    'import/prefer-default-export': 'off',
    'max-classes-per-file': 'off',
    'no-inline-styles': 'off',
  },
}
