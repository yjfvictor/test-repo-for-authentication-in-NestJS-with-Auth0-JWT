/**
 * @file messages.service.ts
 * @brief Service that provides public and protected message content.
 * @details Returns fixed message strings for the public, protected and admin
 * endpoints. Used by MessagesController to demonstrate unauthenticated vs
 * authenticated access. In a real application this would fetch data from a
 * database or other backend.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import { Injectable } from '@nestjs/common';
import { Message } from '../models/messages';

/**
 * @class MessagesService
 * @type class
 * @brief Provides message content for the messages API endpoints.
 * @details Injectable service with three methods: getPublicMessage,
 * getProtectedMessage and getAdminMessage. Each returns a Message object
 * with a text field. Protected and admin messages are intended to be
 * returned only when the client sends a valid JWT (enforced by the controller).
 */
@Injectable()
export class MessagesService {
  /**
   * @fn getPublicMessage
   * @type function
   * @brief Returns the public message (no authentication required).
   * @details Used by the GET /api/messages/public endpoint. The content
   * is safe to expose to unauthenticated clients.
   * @returns {Message} Object with text property set to the public message.
   */
  getPublicMessage(): Message {
    return {
      text: 'This is a public message.',
    };
  }

  /**
   * @fn getProtectedMessage
   * @type function
   * @brief Returns the protected message (requires valid JWT).
   * @details Used by the GET /api/messages/protected endpoint. The controller
   * applies JwtAuthGuard so only authenticated users receive this response.
   * @returns {Message} Object with text property set to the protected message.
   */
  getProtectedMessage(): Message {
    return {
      text: 'This is a protected message.',
    };
  }

  /**
   * @fn getAdminMessage
   * @type function
   * @brief Returns the admin message (requires valid JWT).
   * @details Used by the GET /api/messages/admin endpoint. In a full
   * implementation you would add role-based checks (e.g. only users with
   * admin scope or role can access this). Currently any authenticated user
   * can access it.
   * @returns {Message} Object with text property set to the admin message.
   */
  getAdminMessage(): Message {
    return {
      text: 'This is an admin message.',
    };
  }
}
