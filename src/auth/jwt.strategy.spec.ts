/**
 * @file jwt.strategy.spec.ts
 * @brief Unit tests for JwtStrategy.
 * @details Tests that the strategy validate() method returns the payload
 * as-is. Constructor and Passport integration are not fully tested here
 * (would require mocking jwks-rsa and ConfigService); validate() is
 * the main application logic we own.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  /**
   * @var strategy
   * @type JwtStrategy
   * @brief Instance of JwtStrategy under test.
   * @details Created with mocked ConfigService returning test Auth0 values.
   */
  let strategy: JwtStrategy;

  beforeAll(async () => {
    const mockConfigService: Partial<ConfigService> = {
      get: (key: string): string => {
        const map: Record<string, string> = {
          AUTH0_ISSUER_BASE_URL: 'https://test-tenant.auth0.com/',
          AUTH0_AUDIENCE: 'https://test-api.example.com',
        };
        return map[key] ?? '';
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('validate should return the payload unchanged', () => {
    const payload: { sub?: string; iss?: string } = {
      sub: 'auth0|user-123',
      iss: 'https://test-tenant.auth0.com/',
    };
    const result: unknown = strategy.validate(payload);
    expect(result).toEqual(payload);
    expect(result).toBe(payload);
  });
});
