/**
 * @file messages.service.spec.ts
 * @brief Unit tests for MessagesService.
 * @details Tests that getPublicMessage, getProtectedMessage and getAdminMessage
 * return the expected Message objects with correct text content. No dependencies
 * are mocked; the service is stateless and returns fixed strings.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { Message } from '../models/messages';

describe('MessagesService', () => {
  /**
   * @var service
   * @type MessagesService
   * @brief Instance of MessagesService under test.
   * @details Set in beforeAll after creating the testing module.
   */
  let service: MessagesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesService],
    }).compile();
    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getPublicMessage should return the public message', () => {
    const result: Message = service.getPublicMessage();
    expect(result).toEqual({ text: 'This is a public message.' });
    expect(result.text).toBe('This is a public message.');
  });

  it('getProtectedMessage should return the protected message', () => {
    const result: Message = service.getProtectedMessage();
    expect(result).toEqual({ text: 'This is a protected message.' });
    expect(result.text).toBe('This is a protected message.');
  });

  it('getAdminMessage should return the admin message', () => {
    const result: Message = service.getAdminMessage();
    expect(result).toEqual({ text: 'This is an admin message.' });
    expect(result.text).toBe('This is an admin message.');
  });
});
