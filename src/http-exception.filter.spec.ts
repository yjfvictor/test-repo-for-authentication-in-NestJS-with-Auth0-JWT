/**
 * @file http-exception.filter.spec.ts
 * @brief Unit tests for HttpExceptionFilter.
 * @details Tests that when an HttpException (or UnauthorizedException) is
 * thrown, the filter sets the response status and sends a JSON body with
 * a message field. Covers 404, 401 and 500-style exceptions.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  /**
   * @var filter
   * @type HttpExceptionFilter
   * @brief Instance of HttpExceptionFilter under test.
   * @details Created in beforeAll.
   */
  let filter: HttpExceptionFilter;

  /**
   * @var mockResponse
   * @type { status: jest.Mock; json: jest.Mock }
   * @brief Mock Express response to capture status and json calls.
   * @details Used to build a minimal ArgumentsHost that returns this response.
   */
  let mockResponse: { status: jest.Mock; json: jest.Mock };

  /**
   * @var mockHost
   * @type ArgumentsHost
   * @brief Mock execution context that returns our mock response.
   * @details switchToHttp().getResponse() returns mockResponse.
   */
  let mockHost: ArgumentsHost;

  beforeAll(() => {
    filter = new HttpExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockHost = {
      switchToHttp: (): {
        getResponse: () => typeof mockResponse;
        getRequest: () => object;
        getNext: () => jest.Mock;
      } => ({
        getResponse: (): typeof mockResponse => mockResponse,
        getRequest: (): object => ({}),
        getNext: (): jest.Mock => jest.fn(),
      }),
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    } as unknown as ArgumentsHost;
  });

  afterEach(() => {
    mockResponse.status.mockClear();
    mockResponse.json.mockClear();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should set 401 and return message for UnauthorizedException', () => {
    const exception: HttpException = new UnauthorizedException(
      'Requires authentication',
    );
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Requires authentication',
    });
  });

  it('should set 404 and return "Not Found" for NotFoundException', () => {
    const exception: HttpException = new HttpException(
      'Not Found',
      HttpStatus.NOT_FOUND,
    );
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Not Found' });
  });

  it('should set 500 and return "Internal server error" for InternalServerError', () => {
    const exception: HttpException = new HttpException(
      'Something broke',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal server error',
    });
  });
});
