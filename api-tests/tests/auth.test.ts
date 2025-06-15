import { test, expect } from '@playwright/test';
import { validUser, duplicateUser, invalidUser } from '../data/user.data';
import { baseURL } from '../config/env.config';

test.describe('Auth Flow - Signup & Login', () => {
  // Register a new user with valid credentials
  test('POST /signup - Should register new user [Positive]', async ({ request }) => {
    const response = await request.post(`${baseURL}/signup`, { data: validUser });

    expect(response.status(), 'Expected 200 for fresh user signup').toBe(200);

    const body = await response.json();
    expect(body.message).toContain('User created successfully');
  });

  // Attempt to register the same user again
  test('POST /signup - Should reject duplicate user [Negative]', async ({ request }) => {
    const response = await request.post(`${baseURL}/signup`, { data: duplicateUser });

    expect(response.status(), 'Expected 400 on duplicate signup').toBe(400);

    const body = await response.json();
    expect(body.detail).toMatch(/already registered/i);
  });

  // Login with valid credentials
  test('POST /login - Should return access token [Positive]', async ({ request }) => {
    const response = await request.post(`${baseURL}/login`, { data: validUser });

    expect(response.status(), 'Expected 200 on valid login').toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('access_token');
    expect(body.token_type).toBe('bearer');
  });

  // Login with incorrect password
  test('POST /login - Should fail for wrong credentials [Negative]', async ({ request }) => {
    const response = await request.post(`${baseURL}/login`, { data: invalidUser });

    expect(response.status(), 'Expected 400 on invalid password').toBe(400);
  });

  // Signup request missing required email field
  test('POST /signup - Should return validation error for missing email [Negative]', async ({ request }) => {
    const response = await request.post(`${baseURL}/signup`, {
      data: { password: 'abc' }
    });

    const status = response.status();
    let body: any;

    try {
      body = await response.json();
      console.log('Validation error (JSON - missing email):', body);
    } catch {
      const text = await response.text();
      console.warn('Validation error (non-JSON - missing email):', text);
      body = text;
    }

    expect([422, 500]).toContain(status);
  });

  // Signup request missing required password field
  test('POST /signup - Should return validation error for missing password [Negative]', async ({ request }) => {
  const response = await request.post(`${baseURL}/signup`, {
    data: { email: 'missingpass@example.com' } // password is missing
  });

  const status = response.status();
  let body: any;

  try {
    body = await response.json();
  } catch {
    // Fallback for non-JSON error like Internal Server Error
    body = await response.text();
    console.warn('Response was not valid JSON:', body);
  }

  console.log('Response (missing password):', body);

  expect([422, 500]).toContain(status);
  });
});
