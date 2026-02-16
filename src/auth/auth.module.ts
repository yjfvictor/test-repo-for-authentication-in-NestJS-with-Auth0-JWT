/**
 * @file auth.module.ts
 * @brief NestJS module that registers JWT authentication with Auth0.
 * @details Imports ConfigModule for AUTH0_ISSUER_BASE_URL and AUTH0_AUDIENCE,
 * and registers the JwtStrategy so that Passport can validate Auth0-issued JWTs
 * using the JWKS endpoint. Exports nothing by default; guards are used directly
 * by feature modules that need protected routes.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

/**
 * @class AuthModule
 * @type class
 * @brief Module that configures JWT authentication via Auth0 and JWKS.
 * @details Registers JwtStrategy as a provider so that UseGuards(JwtAuthGuard)
 * can validate the Bearer token using the Auth0 JWKS endpoint. Depends on
 * ConfigModule being loaded globally with AUTH0_ISSUER_BASE_URL and AUTH0_AUDIENCE.
 */
@Module({
  imports: [ConfigModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy],
  exports: [],
})
export class AuthModule {}
