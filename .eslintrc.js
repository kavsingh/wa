module.exports = {
  parser: 'babel-eslint',
  settings: { 'import/resolver': 'webpack' },
  env: { node: true, browser: false },
  plugins: ['prettier'],
  extends: ['mongrel-react', 'prettier', 'prettier/react'],
  rules: {
    'prettier/prettier': 'warn',
    // Styled-jsx requires braces around CSS template literal,
    // causing lint errors
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'ignore' },
    ],
  },
  overrides: [
    {
      files: 'src/**/*.js',
      env: { node: false, browser: true },
    },
    {
      files: 'src/**/*.test.js',
      env: { jest: true },
    },
    {
      files: 'scripts/bin/**/*.js',
      rules: { 'no-console': 'off' },
    },
  ],
}
