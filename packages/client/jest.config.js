/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-node-single-context',
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './test-reports',
  coveragePathIgnorePatterns: ['node_modules'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
};
