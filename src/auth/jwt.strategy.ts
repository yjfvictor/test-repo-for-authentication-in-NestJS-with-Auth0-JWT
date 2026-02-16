/**
 * @file jwt.strategy.ts
 * @brief Passport JWT strategy for validating Auth0-issued access tokens.
 * @details Uses the JWKS (JSON Web Key Set) endpoint from Auth0 to obtain
 * the public key corresponding to the token's key id (kid). Validates signature,
 * audience, issuer and expiration. The validated payload is attached to the
 * request for use by guards and controllers.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * @interface JwtPayload
 * @type interface
 * @brief Decoded JWT payload from Auth0 access token.
 * @details Standard OAuth2/OIDC claims. sub is the user identifier; iss and aud
 * are validated against Auth0 domain and API audience.
 */
interface JwtPayload {
  /**
   * @var sub
   * @type string | undefined
   * @brief Subject - unique identifier for the user or client.
   * @details Set by Auth0; used as the stable user id in the application.
   */
  sub?: string;
  /**
   * @var iss
   * @type string | undefined
   * @brief Issuer - Auth0 tenant URL that issued the token.
   * @details Must match AUTH0_ISSUER_BASE_URL for validation to succeed.
   */
  iss?: string;
  /**
   * @var aud
   * @type string | string[] | undefined
   * @brief Audience - API identifier the token is intended for.
   * @details Must match AUTH0_AUDIENCE (the API identifier in Auth0 Dashboard).
   */
  aud?: string | string[];
  /**
   * @var exp
   * @type number | undefined
   * @brief Expiration time - Unix timestamp when the token expires.
   * @details Checked automatically by passport-jwt; expired tokens are rejected.
   */
  exp?: number;
  /**
   * @var iat
   * @type number | undefined
   * @brief Issued at - Unix timestamp when the token was issued.
   * @details Optional; can be used for token age checks if needed.
   */
  iat?: number;
}

/**
 * @class JwtStrategy
 * @type class
 * @brief Passport strategy for JWT bearer tokens using Auth0 JWKS.
 * @details Extends PassportStrategy(Strategy) so that the Passport JWT strategy
 * is used. secretOrKeyProvider uses jwks-rsa to fetch the public key from
 * AUTH0_ISSUER_BASE_URL/.well-known/jwks.json based on the token's kid. Caching
 * and rate limiting reduce requests to the JWKS endpoint. After successful
 * verification, validate() is called with the decoded payload; its return value
 * is attached to request.user.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * @fn constructor
   * @type function
   * @brief Initialises the JWT strategy with Auth0 issuer, audience and JWKS.
   * @details Reads AUTH0_ISSUER_BASE_URL and AUTH0_AUDIENCE from ConfigService.
   * Builds the JWKS URI as issuerBaseUrl + '.well-known/jwks.json'. Configures
   * passport-jwt to extract the token from the Authorization Bearer header,
   * to use RS256 (Auth0's default), and to validate aud and iss. The
   * secretOrKeyProvider fetches the correct public key by kid from the JWKS endpoint.
   * @param {ConfigService} configService - NestJS config service for environment variables.
   * @returns N/A (constructor).
   */
  constructor(private readonly configService: ConfigService) {
    const issuerBaseUrl: string =
      configService.get<string>('AUTH0_ISSUER_BASE_URL') ?? '';
    const audience: string = configService.get<string>('AUTH0_AUDIENCE') ?? '';
    const jwksUri: string = issuerBaseUrl.endsWith('/')
      ? `${issuerBaseUrl}.well-known/jwks.json`
      : `${issuerBaseUrl}/.well-known/jwks.json`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
      }),
      audience,
      issuer: issuerBaseUrl.endsWith('/') ? issuerBaseUrl : `${issuerBaseUrl}/`,
      algorithms: ['RS256'],
    });
  }

  /**
   * @fn validate
   * @type function
   * @brief Validates the JWT payload and returns the user object attached to the request.
   * @details Called by Passport after the token signature and claims are verified.
   * We return the payload as-is so that controllers can access sub, scope, etc.
   * For stricter typing, you could map to a custom User type and add database lookup.
   * @param {JwtPayload} payload - The decoded JWT payload from the access token.
   * @returns {JwtPayload} The payload to attach to request.user.
   */
  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
