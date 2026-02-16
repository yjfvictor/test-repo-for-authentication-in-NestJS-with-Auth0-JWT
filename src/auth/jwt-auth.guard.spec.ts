/**
 * @file jwt-auth.guard.spec.ts
 * @brief Unit tests for JwtAuthGuard.
 * @details Tests that handleRequest throws UnauthorizedException when user
 * is null/undefined or when err is set, and returns the user when both are
 * valid. canActivate is not unit-tested in isolation as it delegates to
 * Passport; integration tests would cover full request flow.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  /**
   * @var guard
   * @type JwtAuthGuard
   * @brief Instance of JwtAuthGuard under test.
   * @details Created in beforeAll.
   */
  let guard: JwtAuthGuard;

  beforeAll(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('handleRequest', () => {
    it('should throw UnauthorizedException when user is null', () => {
      expect(() => guard.handleRequest(null, null, null)).toThrow(
        UnauthorizedException,
      );
      expect(() => guard.handleRequest(null, null, null)).toThrow(
        'Requires authentication',
      );
    });

    it('should throw UnauthorizedException when user is undefined', () => {
      expect(() =>
        guard.handleRequest(undefined, undefined, undefined),
      ).toThrow(UnauthorizedException);
    });

    it('should rethrow when err is provided', () => {
      const err: Error = new Error('Invalid token');
      expect(() =>
        guard.handleRequest(err, { sub: 'user-1' }, undefined),
      ).toThrow(err);
    });

    it('should return user when err is null and user is provided', () => {
      const user: object = { sub: 'user-123' };
      const result: unknown = guard.handleRequest(null, user, null);
      expect(result).toBe(user);
    });
  });
});
