import { request } from '@playwright/test';
import { baseURL } from '../config/env.config';
import { validUser } from '../data/user.data';

export default async function globalSetup() {
  const context = await request.newContext();

  const loginRes = await context.post(`${baseURL}/login`, {
    data: validUser
  });

  if (loginRes.status() !== 200) {
    console.warn('Login failed during global setup.');
    return;
  }

  const { access_token } = await loginRes.json();
  const authHeader = { Authorization: `Bearer ${access_token}` };

  const booksRes = await context.get(`${baseURL}/books/`, {
    headers: authHeader
  });

  if (booksRes.status() !== 200) {
    console.warn('Failed to fetch books for cleanup.');
    return;
  }

  const books = await booksRes.json();

  for (const book of books) {
    await context.delete(`${baseURL}/books/${book.id}`, {
      headers: authHeader
    });
  }

  console.log(`✅ Global setup cleaned ${books.length} book(s).`);
  await context.dispose();
}
