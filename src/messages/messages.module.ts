/**
 * @file messages.module.ts
 * @brief NestJS module that registers the messages feature.
 * @details Declares MessagesService and MessagesController and exports nothing.
 * The messages routes are mounted under the global prefix (e.g. /api/messages).
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

/**
 * @class MessagesModule
 * @type class
 * @brief Module that provides the messages API (public and protected endpoints).
 * @details Registers the controller and service. The controller uses
 * JwtAuthGuard from the auth module for protected routes; ensure AuthModule
 * is imported in AppModule so that JwtStrategy is available.
 */
@Module({
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [],
})
export class MessagesModule {}
