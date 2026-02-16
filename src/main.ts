/**
 * @file main.ts
 * @brief Application entry point that bootstraps the NestJS server.
 * @details Creates the Nest application, validates required environment variables
 * (PORT, AUTH0_ISSUER_BASE_URL, AUTH0_AUDIENCE, CLIENT_ORIGIN_URL), sets the
 * global API prefix, applies the global exception filter, nocache and helmet
 * middleware, and CORS. Then listens on PORT. Exits if any required env var is missing.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import helmet from 'helmet';
import * as nocache from 'nocache';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

/**
 * @fn checkEnvironment
 * @type function
 * @brief Ensures all required environment variables are defined.
 * @details Reads PORT, AUTH0_ISSUER_BASE_URL, AUTH0_AUDIENCE and CLIENT_ORIGIN_URL
 * from the config service. If any is missing or empty, throws an Error so that
 * the application fails fast at startup rather than at first request.
 * @param {ConfigService} configService - NestJS config service (env vars).
 * @returns {void}
 */
function checkEnvironment(configService: ConfigService): void {
  const requiredEnvVars: string[] = [
    'PORT',
    'AUTH0_ISSUER_BASE_URL',
    'AUTH0_AUDIENCE',
    'CLIENT_ORIGIN_URL',
  ];

  for (const envVar of requiredEnvVars) {
    const value: string | undefined = configService.get<string>(envVar);
    if (value === undefined || value === '') {
      throw new Error(`Undefined environment variable: ${envVar}`);
    }
  }
}

/**
 * @fn bootstrap
 * @type function
 * @brief Creates the Nest application and starts the HTTP server.
 * @details Creates AppModule, retrieves ConfigService, runs checkEnvironment,
 * sets global prefix 'api', registers HttpExceptionFilter globally, applies
 * nocache and helmet (HSTS, frameguard, CSP), enables CORS for CLIENT_ORIGIN_URL,
 * and calls listen(PORT). All routes are under /api (e.g. /api/messages/public).
 * @returns {Promise<void>}
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  checkEnvironment(configService);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(nocache());
  app.enableCors({
    origin: configService.get<string>('CLIENT_ORIGIN_URL'),
    methods: ['GET'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    maxAge: 86400,
  });
  app.use(
    helmet({
      hsts: { maxAge: 31536000 },
      frameguard: { action: 'deny' },
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'frame-ancestors': ["'none'"],
        },
      },
    }),
  );

  const port: string | number = configService.get<string>('PORT') ?? 6060;
  await app.listen(port);
}

bootstrap();
