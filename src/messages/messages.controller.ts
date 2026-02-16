/**
 * @file messages.controller.ts
 * @brief HTTP controller for public and protected message endpoints.
 * @details Exposes GET /messages/public (no auth), GET /messages/protected
 * and GET /messages/admin (both protected by JwtAuthGuard). Demonstrates
 * how to protect API routes so that only authenticated users can access them.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { Message } from '../models/messages';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * @class MessagesController
 * @type class
 * @brief Controller that serves public and JWT-protected message resources.
 * @details Injects MessagesService and defines three GET routes. The protected
 * and admin routes use UseGuards(JwtAuthGuard) so that the Passport JWT strategy
 * runs and validates the Bearer token before the handler executes. If the token
 * is missing or invalid, the client receives 401 Unauthorized.
 */
@Controller('messages')
export class MessagesController {
  /**
   * @var messagesService
   * @type MessagesService
   * @brief Injected service that provides message content.
   * @details Used to obtain the text for each endpoint response.
   */
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * @fn getPublic
   * @type function
   * @brief Handles GET /messages/public (no authentication required).
   * @details Returns the public message. Any client can call this endpoint
   * without an Authorization header. Used to verify the API is running.
   * @returns {Promise<Message>} The public message object.
   */
  @Get('public')
  async getPublic(): Promise<Message> {
    return this.messagesService.getPublicMessage();
  }

  /**
   * @fn getProtected
   * @type function
   * @brief Handles GET /messages/protected (requires valid JWT).
   * @details UseGuards(JwtAuthGuard) ensures the request has a valid Auth0
   * access token in the Authorization: Bearer <token> header. If not, the
   * guard throws UnauthorizedException and the handler is not executed.
   * @returns {Promise<Message>} The protected message object.
   */
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  async getProtected(): Promise<Message> {
    return this.messagesService.getProtectedMessage();
  }

  /**
   * @fn getAdmin
   * @type function
   * @brief Handles GET /messages/admin (requires valid JWT).
   * @details Same protection as getProtected. In production you would add
   * an additional guard or decorator to check for admin role/scope.
   * @returns {Promise<Message>} The admin message object.
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async getAdmin(): Promise<Message> {
    return this.messagesService.getAdminMessage();
  }
}
