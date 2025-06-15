import { test, expect } from '@playwright/test';
import { baseURL } from '../config/env.config';

test.describe('Health & Edge Routes', () => {
  test('GET /health - Should return service status', async ({ request }) => {
    const response = await request.get(`${baseURL}/health`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('up');
  });

  test('GET /invalid-path - Should return 404 [Negative]', async ({ request }) => {
    const response = await request.get(`${baseURL}/no-such-endpoint`);
    expect(response.status()).toBe(404);
  });
});
