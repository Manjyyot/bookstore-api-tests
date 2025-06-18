// utils/auth.helper.ts

import { request } from '@playwright/test';
import { baseURL } from '../config/env.config';
import { faker } from '@faker-js/faker';

let cachedToken: string | null = null;

/**
 * Creates a new user and retrieves an access token.
 * If already created in this session, returns the cached token.
 */
export async function getAuthToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  const email = faker.internet.email().toLowerCase();
  const password = 'SecurePass123!';

  const context = await request.newContext();

  // Sign up new user
  const signupRes = await context.post(`${baseURL}/signup`, {
    data: { email, password }
  });

  if (![200, 201].includes(signupRes.status())) {
    console.warn(`Signup failed: ${signupRes.status()} - Proceeding to login anyway`);
  }

  // Log in with the new user
  const loginRes = await context.post(`${baseURL}/login`, {
    data: { email, password }
  });

  if (loginRes.status() !== 200) {
    throw new Error(`Login failed with status: ${loginRes.status()}`);
  }

  const body = await loginRes.json();
  if (!body.access_token) {
    throw new Error('No access_token found in login response');
  }

  cachedToken = body.access_token;
  return cachedToken;
}
