module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-debugger': 'off',
    'no-console': 0,
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    semi: 'off'
  }
};
