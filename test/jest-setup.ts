/**
 * @file jest-setup.ts
 * @brief Jest setup file run before each test run.
 * @details Used to set environment variables or global mocks required by
 * tests. Currently sets minimal Auth0-related env vars so that modules
 * that read config do not fail when tests load. Can be extended for
 * global test fixtures.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

/**
 * @var AUTH0_ISSUER_BASE_URL
 * @type string
 * @brief Auth0 issuer base URL for test environment.
 * @details Used by JwtStrategy in tests when ConfigModule is loaded.
 * Points to a dummy URL; actual validation is mocked in unit tests.
 */
process.env.AUTH0_ISSUER_BASE_URL =
  process.env.AUTH0_ISSUER_BASE_URL ?? 'https://test-tenant.auth0.com/';

/**
 * @var AUTH0_AUDIENCE
 * @type string
 * @brief Auth0 API audience for test environment.
 * @details Used by JwtStrategy in tests when ConfigModule is loaded.
 */
process.env.AUTH0_AUDIENCE =
  process.env.AUTH0_AUDIENCE ?? 'https://test-api.example.com';

/**
 * @var CLIENT_ORIGIN_URL
 * @type string
 * @brief Allowed CORS origin for test environment.
 * @details Used by main.ts bootstrap when ConfigService is used; set here for tests that bootstrap the app.
 */
process.env.CLIENT_ORIGIN_URL =
  process.env.CLIENT_ORIGIN_URL ?? 'http://localhost:4040';

/**
 * @var PORT
 * @type string
 * @brief HTTP port for test environment.
 * @details Used by bootstrap when listening; avoids conflict with dev server.
 */
process.env.PORT = process.env.PORT ?? '6061';
