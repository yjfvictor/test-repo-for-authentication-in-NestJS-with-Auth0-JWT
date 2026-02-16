/**
 * @file messages.controller.spec.ts
 * @brief Unit tests for MessagesController.
 * @details Tests that the controller returns the correct message for each
 * route. JwtAuthGuard is mocked so that protected routes can be tested
 * without a real token. Public route is tested with no auth; protected
 * and admin routes use a mock guard that allows the request to proceed.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Message } from '../models/messages';

describe('MessagesController', () => {
  /**
   * @var controller
   * @type MessagesController
   * @brief Instance of MessagesController under test.
   * @details Set in beforeAll after creating the testing module.
   */
  let controller: MessagesController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [MessagesService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (): boolean => true })
      .compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getPublic should return the public message', async () => {
    const result: Message = await controller.getPublic();
    expect(result).toEqual({ text: 'This is a public message.' });
  });

  it('getProtected should return the protected message when guard allows', async () => {
    const result: Message = await controller.getProtected();
    expect(result).toEqual({ text: 'This is a protected message.' });
  });

  it('getAdmin should return the admin message when guard allows', async () => {
    const result: Message = await controller.getAdmin();
    expect(result).toEqual({ text: 'This is an admin message.' });
  });
});
