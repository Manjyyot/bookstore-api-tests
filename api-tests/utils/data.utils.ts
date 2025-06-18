/**
 * Returns an intentionally malformed JSON string to test invalid request body handling.
 */
export function getMalformedJSON(): string {
  return `{"email": "test@example.com", "password": bad_json}`;
}
