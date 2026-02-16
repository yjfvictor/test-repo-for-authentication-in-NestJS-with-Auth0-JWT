/**
 * @file http-exception.filter.ts
 * @brief Global exception filter that formats HTTP errors as JSON.
 * @details Catches HttpException (and subclasses such as UnauthorizedException)
 * and sends a consistent JSON body with a message field. Uses a small map for
 * 404 and 500; other status codes use the exception message. Ensures API
 * clients always receive a predictable error shape.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorMessage } from './models/messages';

/**
 * @var errorMessages
 * @type Record<number, string>
 * @brief Default message text for selected HTTP status codes.
 * @details Used when we want to return a generic message instead of the
 * exception message (e.g. to avoid leaking internal details for 500 errors).
 */
const errorMessages: Record<number, string> = {
  [HttpStatus.NOT_FOUND]: 'Not Found',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal server error',
};

/**
 * @class HttpExceptionFilter
 * @type class
 * @brief Filter that converts HttpException into a JSON response.
 * @details Implements ExceptionFilter so that when any HttpException is
 * thrown (e.g. UnauthorizedException from JwtAuthGuard), the response
 * status is set to exception.getStatus() and the body is { message: string }.
 * For 404 and 500 we use the errorMessages map; otherwise we use exception.message.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * @fn catch
   * @type function
   * @brief Handles the thrown HttpException and sends the JSON response.
   * @details Switches to the HTTP context, gets the Response object, and
   * retrieves the status code from the exception. Builds an ErrorMessage
   * with message set to errorMessages[status] if present, else exception.message.
   * Sends the response with response.status(status).json(body).
   * @param {HttpException} exception - The thrown HTTP exception.
   * @param {ArgumentsHost} host - NestJS arguments host to get the response.
   * @returns {void}
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const status: number = exception.getStatus();
    const body: ErrorMessage = {
      message: errorMessages[status] ?? exception.message,
    };
    response.status(status).json(body);
  }
}
