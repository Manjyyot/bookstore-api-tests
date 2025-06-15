import { request } from '@playwright/test';
import { baseURL } from '../config/env.config';
import { validUser } from '../data/user.data';

export async function getAuthToken(): Promise<string> {
  const context = await request.newContext();

  // 1. First, attempt to sign up the user
  await context.post(`${baseURL}/signup`, {
    data: validUser
    // Note: Don't assert status here—if the user is already registered, it's fine
  });

  // 2. Then, attempt login with the same user
  const response = await context.post(`${baseURL}/login`, {
    data: validUser
  });

  if (response.status() !== 200) {
    const errorText = await response.text();
    console.error('Login failed with response:', errorText);
    throw new Error('Login failed');
  }

  const body = await response.json();
  return body.access_token;
}
