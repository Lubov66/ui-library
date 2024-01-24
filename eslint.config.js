import path from 'node:path';
import rotki from '@rotki/eslint-config';

export default rotki({
  vue: true,
  typescript: {
    tsconfigPath: 'tsconfig.eslint.json',
  },
  stylistic: true,
  formatters: true,
  storybook: true,
  test: true,
  cypress: {
    testDirectory: path.join('example', 'cypress'),
  },
}, {
  files: ['src/**/*.ts'],
  rules: {
    'perfectionist/sort-objects': 'error',
  },
}, {
  files: ['src/**/*.stories.ts', '**/vue-shim.d.ts', '.storybook/**/*.ts'],
  rules: {
    'import/no-default-export': 'off',
  },
}, {
  files: ['src/**/*.@(ts|vue)'],
  rules: {
    'import/no-named-default': 'warn', // todo: fix and turn into an error
  },
});
