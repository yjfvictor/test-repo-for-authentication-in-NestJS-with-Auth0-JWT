# Authentication in NestJS with Auth0 and JWT

Test repository demonstrating **authentication in a NestJS API** using **Auth0** and **JWT** (JSON Web Tokens), with verification of access tokens via **JWKS** (JSON Web Key Set) using the `jwks-rsa` library.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Dependencies](#dependencies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Code Structure and Summary](#code-structure-and-summary)
- [Testing](#testing)
- [Debugging](#debugging)
- [Documentation](#documentation)
- [Security Considerations](#security-considerations)

---

## Overview

This project is a minimal NestJS API that:

- Registers an Auth0-compatible JWT strategy using **Passport** and **passport-jwt**.
- Fetches the public keys used to verify tokens from Auth0’s **JWKS** endpoint via **jwks-rsa**.
- Exposes a **public** endpoint (no auth) and **protected** endpoints that require a valid Auth0 access token in the `Authorization: Bearer <token>` header.
- Uses a global HTTP exception filter and security headers (Helmet, CORS, nocache).

All code is written in **TypeScript** with explicit types and **Doxygen-style** comments. The project is licensed under the **MIT License**.

---

## Features

- **Auth0 integration**: Validates access tokens issued by Auth0 using the tenant’s JWKS endpoint.
- **JWT-based authentication**: Bearer token in `Authorization` header; signature, audience and issuer are verified.
- **JWKS (jwks-rsa)**: Public keys are fetched from `AUTH0_ISSUER_BASE_URL/.well-known/jwks.json`; key rotation is supported via the `kid` (key id) in the token.
- **Protected routes**: Use `JwtAuthGuard` so that only requests with a valid JWT are allowed.
- **Public and protected endpoints**: Example messages API with one public and two protected routes.
- **Environment-based configuration**: Auth0 domain and audience via `AUTH0_ISSUER_BASE_URL` and `AUTH0_AUDIENCE`.
- **Security**: Helmet (HSTS, frameguard, CSP), CORS, nocache; global exception filter for consistent error responses.
- **Tests**: Unit tests for service, controller, guard, strategy and exception filter.
- **Documentation**: Doxygen-style comments throughout; HTML docs generated with Doxygen.

---

## Dependencies

### Production

| Package | Purpose |
| ------- | ------- |
| `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` | NestJS core |
| `@nestjs/config` | Environment and configuration |
| `@nestjs/jwt` | JWT utilities (used alongside Passport) |
| `@nestjs/passport` | Passport integration |
| `passport`, `passport-jwt` | JWT strategy and Bearer extraction |
| `jwks-rsa` | Fetch Auth0 public keys from JWKS endpoint |
| `helmet` | Security headers |
| `nocache` | Disable response caching |
| `reflect-metadata`, `rxjs` | Required by NestJS |

### Development

| Package | Purpose |
| ------- | ------- |
| `@nestjs/cli` (^11.0.16) | Nest CLI (build, start, generate) |
| `@nestjs/testing` | Testing utilities |
| `typescript`, `ts-node`, `ts-jest`, `ts-loader` | TypeScript and Jest |
| `jest` | Unit tests |
| `eslint`, `@eslint/js`, `typescript-eslint` | Linting (flat config) |
| `@types/*` | Type definitions |

---

## Prerequisites

- **Node.js** v20 or later.
- **npm** (or yarn/pnpm).
- An **Auth0** account and an **API** created in the Auth0 Dashboard (for audience and issuer).
- (Optional) **Doxygen** to generate HTML documentation from comments.

---

## Installation

```bash
git clone https://github.com/yjfvictor/test-repo-for-authentication-in-NestJS-with-Auth0-JWT.git
cd test-repo-for-authentication-in-NestJS-with-Auth0-JWT
npm install
```

---

## Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your Auth0 and server settings:

   - **PORT**: Port the server listens on (e.g. `6060`).
   - **AUTH0_ISSUER_BASE_URL**: Auth0 tenant URL (e.g. `https://your-tenant.auth0.com/`). Get it from Auth0 Dashboard → Tenant settings → Domain.
   - **AUTH0_AUDIENCE**: API identifier (audience) from Auth0 Dashboard → APIs → your API → Identifier.
   - **CLIENT_ORIGIN_URL**: Allowed CORS origin (e.g. `http://localhost:4040` for a local SPA).

3. To obtain a test access token: Auth0 Dashboard → APIs → your API → Test tab → Create & Authorize Test Application (if needed) → copy the access token from the Response.

---

## Running the Application

- Development (watch mode):

  ```bash
  npm run start:dev
  ```

- Production build and run:

  ```bash
  npm run build
  npm run start:prod
  ```

The API is served under the global prefix **`/api`** (e.g. base URL `http://localhost:6060/api`).

---

## API Endpoints

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/api/messages/public` | No | Returns a public message. |
| GET | `/api/messages/protected` | Yes (JWT) | Returns a protected message. Requires `Authorization: Bearer <access_token>`. |
| GET | `/api/messages/admin` | Yes (JWT) | Returns an admin message. Same requirement as protected. |

Example request for a protected endpoint:

```bash
curl -i -H "Authorization: Bearer YOUR_AUTH0_ACCESS_TOKEN" \
  http://localhost:6060/api/messages/protected
```

---

## Authentication Flow

The following diagram illustrates how a request to a protected route is authenticated using Auth0 and JWKS.

```mermaid
sequenceDiagram
  participant Client
  participant API as NestJS API
  participant Guard as JwtAuthGuard
  participant Passport as Passport JWT Strategy
  participant JWKS as Auth0 JWKS Endpoint

  Client->>API: GET /api/messages/protected\nAuthorization: Bearer <token>
  API->>Guard: canActivate()
  Guard->>Passport: validate request (extract JWT)
  Passport->>Passport: decode JWT header (get kid)
  Passport->>JWKS: GET /.well-known/jwks.json (if key not cached)
  JWKS-->>Passport: public key for kid
  Passport->>Passport: verify signature, aud, iss, exp
  Passport->>Passport: validate(payload)
  Passport-->>Guard: user = payload
  Guard-->>API: true
  API-->>Client: 200 { "text": "This is a protected message." }
```

High-level flow:

1. Client sends a request with `Authorization: Bearer <access_token>`.
2. `JwtAuthGuard` invokes the Passport JWT strategy.
3. The strategy extracts the token and uses **jwks-rsa** to resolve the public key from Auth0’s JWKS endpoint (by `kid`).
4. The token’s signature and claims (audience, issuer, expiration) are verified.
5. If valid, the decoded payload is attached to the request and the guard allows access; otherwise a 401 is returned.

---

## Code Structure and Summary

```mermaid
flowchart TB
  subgraph Entry
    main[main.ts]
  end
  subgraph App
    AppModule[AppModule]
  end
  subgraph Auth
    AuthModule[AuthModule]
    JwtStrategy[JwtStrategy]
    JwtAuthGuard[JwtAuthGuard]
  end
  subgraph Messages
    MessagesModule[MessagesModule]
    MessagesController[MessagesController]
    MessagesService[MessagesService]
  end
  subgraph Shared
    HttpExceptionFilter[HttpExceptionFilter]
    Message[Message interface]
  end

  main --> AppModule
  AppModule --> AuthModule
  AppModule --> MessagesModule
  AuthModule --> JwtStrategy
  JwtAuthGuard --> JwtStrategy
  MessagesController --> JwtAuthGuard
  MessagesController --> MessagesService
  AppModule --> HttpExceptionFilter
  MessagesService --> Message
```

### Code change summary

- **`src/main.ts`**: Bootstrap; env validation; global prefix `api`; `HttpExceptionFilter`; CORS; Helmet; nocache.
- **`src/app.module.ts`**: Imports `ConfigModule`, `AuthModule`, `MessagesModule`.
- **`src/auth/auth.module.ts`**: Registers `PassportModule` and `JwtStrategy`.
- **`src/auth/jwt.strategy.ts`**: Passport JWT strategy with `secretOrKeyProvider` from **jwks-rsa** (`passportJwtSecret`); validates `aud`, `iss`, `RS256`; `validate()` returns payload.
- **`src/auth/jwt-auth.guard.ts`**: Extends `AuthGuard('jwt')`; throws `UnauthorizedException` when user is missing or strategy fails.
- **`src/messages/*`**: Controller with `getPublic`, `getProtected`, `getAdmin`; `getProtected` and `getAdmin` use `UseGuards(JwtAuthGuard)`; service returns fixed message objects.
- **`src/models/messages.ts`**: `Message` and `ErrorMessage` interfaces.
- **`src/http-exception.filter.ts`**: Maps `HttpException` to JSON `{ message: string }` and appropriate status code.
- **`test/*.spec.ts`**: Unit tests for service, controller, guard, strategy and filter.
- **`package.json`**: MIT license; `@nestjs/cli` ^11.0.16; Node >=20; scripts for build, start, test, lint, doc.
- **`tsconfig.json`**: `inlineSourceMap: true`, `inlineSources: true`, `sourceMap: false`, `removeComments: false`.
- **`eslint.config.ts`**: ESLint 9 flat config; TypeScript recommended rules.
- **`jest.config.ts`**: Jest for `*.spec.ts`; setup file for env vars; coverage from `src/`.

---

## Testing

- Run all unit tests:

  ```bash
  npm test
  ```

- Run tests in watch mode:

  ```bash
  npm run test:watch
  ```

- Run tests with coverage:

  ```bash
  npm run test:cov
  ```

- Run tests with Node inspector (debug):

  ```bash
  npm run test:debug
  ```

Tests cover:

- **MessagesService**: Public, protected and admin message content.
- **MessagesController**: All three routes (guard mocked so protected routes run).
- **JwtAuthGuard**: `handleRequest` behaviour when user/err are null or set.
- **JwtStrategy**: `validate()` returns payload (ConfigService mocked).
- **HttpExceptionFilter**: Status and JSON body for 401, 404, 500.

---

## Debugging

- **Application (VS Code / Cursor)**  
  Use the "start:debug" script and attach the debugger to the Node process (e.g. port 9229). Breakpoints in `main.ts`, guards and controllers will hit when requests are made.

- **Unit tests**  
  Run `npm run test:debug` and attach the debugger to the Jest/Node process to step through tests.

- **Auth0 / JWT issues**  
  - Confirm `AUTH0_ISSUER_BASE_URL` has no path (e.g. `https://tenant.auth0.com/`).  
  - Confirm `AUTH0_AUDIENCE` matches the API identifier in Auth0.  
  - Ensure the token is an **access token** for the same API (audience).  
  - Check token expiration and that the JWKS URL is reachable from the server.

---

## Documentation

- Inline documentation is in **Doxygen** style (e.g. `@file`, `@brief`, `@param`, `@returns`, `@class`, `@interface`).
- Generate HTML documentation:

  ```bash
  npm run doc
  ```

  This runs `doxygen Doxyfile` and writes output to **`docs/`**. Open `docs/html/index.html` in a browser.

---

## Security Considerations

- Do not commit `.env` or real tokens; use `.env.example` as a template.
- CORS is restricted to `CLIENT_ORIGIN_URL`; adjust for your front-end origin.
- Helmet is used for HSTS, frameguard and CSP.
- JWTs are verified with RS256 and Auth0’s public keys; never trust unsigned or self-issued tokens in production.
- For production, consider rate limiting, logging and role/scope checks on protected routes (e.g. admin-only).
