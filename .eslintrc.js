const path = require('path');

module.exports = {
  env: {
    node: true,
    mocha: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './packages/access-control/tsconfig.json',
      './packages/common/tsconfig.json',
      './packages/core/tsconfig.json',
      './packages/crud/tsconfig.json',
      './packages/messaging/tsconfig.json',
      './packages/queue/tsconfig.json',
      './packages/router/tsconfig.json',
      './packages/scheduler/tsconfig.json',
    ],
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/resolver': {
      'eslint-import-resolver-lerna': {
        packages: path.resolve(__dirname, './packages'),
      },
    },
  },
  rules: {
    'import/no-unresolved': 'off',
    'import/first': 'error',
    'import/extensions': 0,
    'max-classes-per-file': [0],
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    indent: 'off',
    'array-bracket-spacing': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'prettier/prettier': 'error',
    'brace-style': ['error', '1tbs'],
    'func-names': ['error', 'always'],
    'no-use-before-define': 'error',
    'no-underscore-dangle': ['error', { allow: ['_id', '_registryMap'] }],
    'class-methods-use-this': 'off',
    camelcase: 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/interface-name-prefix': [
      'error',
      { prefixWithI: 'always' },
    ],
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/camelcase': 'error',
    '@typescript-eslint/class-name-casing': 'error',
    curly: ['error', 'all'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        packageDir: [
          './',
          './packages/access-control/',
          './packages/common/',
          './packages/core/',
          './packages/messaging/',
          './packages/queue/',
          './packages/router/',
          './packages/scheduler/',
        ],
      },
    ],
  },
};
