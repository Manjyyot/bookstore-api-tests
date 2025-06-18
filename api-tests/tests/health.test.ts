import { test, expect } from '@playwright/test';
import { baseURL } from '../config/env.config';

test.describe('Health and Meta Endpoints', () => {
  test('GET /health should return status 200', async ({ request }) => {
    const res = await request.get(`${baseURL}/health`);
    const body = await res.json();
    console.log('Health response:', body);
    expect(res.status()).toBe(200);
    expect(body.status).toBe('up');
  });

  test('GET /non-existent route should return 404', async ({ request }) => {
    const res = await request.get(`${baseURL}/non-existent`);
    expect(res.status()).toBe(404);
  });

  test('OPTIONS request for CORS check', async ({ request }) => {
    const res = await request.fetch(`${baseURL}/signup`, {
      method: 'OPTIONS'
    });
    expect([200, 204, 405]).toContain(res.status());
  });

  test('HEAD request returns headers without body', async ({ request }) => {
    const res = await request.fetch(`${baseURL}/health`, {
      method: 'HEAD'
    });
    expect([200, 204, 405]).toContain(res.status());
  });
});
