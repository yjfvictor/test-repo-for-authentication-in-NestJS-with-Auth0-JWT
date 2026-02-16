/**
 * @file messages.ts
 * @brief Data transfer and error message interfaces for the messages feature.
 * @details Defines the shape of API response payloads and error messages used
 * by the messages controller and service. Used for both public and protected
 * message endpoints.
 * @author Victor Yeh
 * @date 2026-02-16
 * @copyright MIT License
 */

/**
 * @interface Message
 * @type interface
 * @brief Payload returned by message endpoints.
 * @details Contains a single text field carrying the message content returned
 * to the client. All message endpoints (public, protected, admin) return this type.
 */
export interface Message {
  /**
   * @var text
   * @type string
   * @brief The message content.
   * @details Human-readable text returned in the API response body.
   */
  readonly text: string;
}

/**
 * @interface ErrorMessage
 * @type interface
 * @brief Standard error response body for HTTP error responses.
 * @details Used by the global HTTP exception filter to return a consistent
 * JSON structure when an exception is thrown (e.g. 401 Unauthorized, 404 Not Found).
 */
export interface ErrorMessage {
  /**
   * @var message
   * @type string
   * @brief The error message or status description.
   * @details Describes the reason for the error for client-side handling or display.
   */
  readonly message: string;
}
