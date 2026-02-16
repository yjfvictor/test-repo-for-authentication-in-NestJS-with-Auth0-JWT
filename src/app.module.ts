/**
 * @file app.module.ts
 * @brief Root application module for the NestJS Auth0 JWT API.
 * @details Imports ConfigModule (global), AuthModule (JWT strategy with JWKS)
 * and MessagesModule (public and protected message endpoints). Serves as the
 * single entry point for feature modules. No controllers or providers at root.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';

/**
 * @class AppModule
 * @type class
 * @brief Root module that composes the Auth0 JWT authentication API.
 * @details ConfigModule.forRoot({ isGlobal: true }) loads environment variables
 * from .env so that AUTH0_ISSUER_BASE_URL and AUTH0_AUDIENCE are available to
 * JwtStrategy. AuthModule registers the JWT strategy; MessagesModule exposes
 * the message endpoints (some protected by JwtAuthGuard).
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
