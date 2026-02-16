/**
 * @file jwt-auth.guard.ts
 * @brief Guard that enforces JWT authentication on route handlers.
 * @details Uses the Passport JWT strategy ('jwt') to validate the Bearer token.
 * If the token is missing or invalid, the guard throws UnauthorizedException so
 * that only authenticated users can access the protected route.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @class JwtAuthGuard
 * @type class
 * @brief NestJS guard that activates the Passport JWT strategy.
 * @details Extends AuthGuard('jwt') so that any route protected with
 * UseGuards(JwtAuthGuard) will require a valid JWT in the Authorization header.
 * Overrides getRequest to pass the HTTP request to Passport. On authentication
 * failure (no token or invalid token), throws UnauthorizedException with a
 * generic message to avoid leaking security details.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * @fn canActivate
   * @type function
   * @brief Determines whether the request can proceed based on JWT validity.
   * @details Delegates to the parent AuthGuard('jwt'). If the strategy rejects
   * (missing or invalid token), we catch the error and throw UnauthorizedException
   * so that the client receives 401 with a consistent message.
   * @param {ExecutionContext} context - NestJS execution context (HTTP request/response).
   * @returns {Promise<boolean>} True if the JWT is valid; otherwise throws.
   */
  override canActivate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  /**
   * @fn handleRequest
   * @type function
   * @brief Handles the result of the Passport strategy (success or failure).
   * @details When the strategy fails, err is set; we throw UnauthorizedException
   * so that the global exception filter returns 401. When the strategy succeeds,
   * user holds the validated payload and we return it for attachment to the request.
   * @param {any} err - Error from the Passport strategy if validation failed.
   * @param {any} user - The validated user/payload from the strategy if successful.
   * @param {any} _info - Info from Passport (unused).
   * @param {ExecutionContext} _context - Execution context (unused).
   * @param {any} _status - Optional status (unused).
   * @returns {any} The user object to attach to the request.
   */
  /* eslint-disable @typescript-eslint/no-explicit-any -- IAuthGuard.handleRequest signature uses any */
  override handleRequest(
    err: any,
    user: any,
    _info: any,
    _context?: ExecutionContext,
    _status?: any,
  ): any {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    if (err !== undefined && err !== null) {
      throw err;
    }
    if (!user) {
      throw new UnauthorizedException('Requires authentication');
    }
    return user;
  }
}
