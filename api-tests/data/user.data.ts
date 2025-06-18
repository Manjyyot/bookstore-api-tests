import { v4 as uuid } from 'uuid';

/**
 * Generates a unique valid user with a random email and secure password.
 */
export function generateValidUser() {
  return {
    email: `user.${uuid()}@example.com`,
    password: `Pass${Math.floor(Math.random() * 10000)}!`
  };
}

/**
 * Reuses the same credentials as an existing user to simulate a duplicate registration attempt.
 */
export function generateDuplicateUser(baseUser: { email: string; password: string }) {
  return {
    email: baseUser.email,
    password: baseUser.password
  };
}

/**
 * Uses the correct email but an invalid password for negative login testing.
 */
export function generateInvalidUser(baseUser: { email: string }) {
  return {
    email: baseUser.email,
    password: 'WrongPassword123!'
  };
}
