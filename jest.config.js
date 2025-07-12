export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.js'],
  testMatch: ['**/test/**/*.test.js'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
