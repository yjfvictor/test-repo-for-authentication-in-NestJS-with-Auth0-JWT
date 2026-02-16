/**
 * @file jest.config.ts
 * @brief Jest configuration for unit and integration tests.
 * @details Configures the test environment (node), module path mapping,
 * transform for TypeScript, and coverage collection. Test files match
 * Test files match the pattern *.spec.ts. setupFiles load env vars for tests.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import type { Config } from 'jest';

/**
 * @var config
 * @type Config
 * @brief Jest configuration object.
 * @details rootDir is project root; testRegex matches .spec.ts files;
 * collectCoverageFrom includes src except main.ts; testEnvironment is node.
 */
const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s', '!src/main.ts'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test/jest-setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
