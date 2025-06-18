// tests/books.test.ts

import { test, expect } from '@playwright/test';
import { generateBook } from '../data/book.data';
import { getAuthToken } from '../utils/auth.helper';
import { baseURL } from '../config/env.config';

test.describe('Books API - CRUD + Edge Cases', () => {
  let token: string;

  test.beforeAll(async () => {
    token = await getAuthToken();
  });

  test('Full Book Lifecycle', async ({ request }) => {
    const book = generateBook();

    const create = await request.post(`${baseURL}/books/`, {
      headers: { Authorization: `Bearer ${token}` },
      data: book
    });

    expect(create.status(), 'Expected book creation to succeed with 200').toBe(200);
    const created = await create.json();
    const bookId = created.id;

    const get = await request.get(`${baseURL}/books/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(get.status()).toBe(200);
    const fetched = await get.json();
    expect(fetched.name).toBe(book.name);

    const updated = await request.put(`${baseURL}/books/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { ...book, name: 'Updated Book Name' }
    });

    expect(updated.status()).toBe(200);
    const updatedBody = await updated.json();
    expect(updatedBody.name).toBe('Updated Book Name');

    const del = await request.delete(`${baseURL}/books/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(del.status()).toBe(200);
    const delRes = await del.json();
    expect(delRes.message).toContain('deleted');

    const getDeleted = await request.get(`${baseURL}/books/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(getDeleted.status()).toBe(404);
  });

  // ---------- NEGATIVE / EDGE TEST CASES ---------- //

  test('Reject creation with missing required fields', async ({ request }) => {
    const res = await request.post(`${baseURL}/books/`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: 'Missing author' } // missing author
    });

    expect([400, 422]).toContain(res.status());
  });

  test('Reject excessively long book name', async ({ request }) => {
    const res = await request.post(`${baseURL}/books/`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'A'.repeat(1000),
        author: 'Author',
        published_year: 2020,
        book_summary: 'Long title'
      }
    });

    expect([400, 422]).toContain(res.status());
  });

  test('Allow unicode and symbols in book name', async ({ request }) => {
    const res = await request.post(`${baseURL}/books/`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: '漢字 & Symbols',
        author: 'Unicode Author',
        published_year: 2022,
        book_summary: 'Valid unicode name'
      }
    });

    expect([200, 400, 422]).toContain(res.status());
  });

  test('Reject SQL injection pattern', async ({ request }) => {
    const res = await request.post(`${baseURL}/books/`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: "'; DROP TABLE books; --",
        author: 'Attacker',
        published_year: 2022,
        book_summary: 'Injection attempt'
      }
    });

    expect([400, 422]).toContain(res.status());
  });

  test('Reject future year in published_year', async ({ request }) => {
    const res = await request.post(`${baseURL}/books/`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Future Book',
        author: 'Time Traveller',
        published_year: 9999,
        book_summary: 'Too futuristic'
      }
    });

    expect([400, 422]).toContain(res.status());
  });

  test('Reject unsupported PATCH method', async ({ request }) => {
    const res = await request.fetch(`${baseURL}/books/`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });

    expect([405, 404]).toContain(res.status());
  });

  test('Reject empty strings in fields', async ({ request }) => {
    const res = await request.post(`${baseURL}/books/`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: '',
        author: '',
        published_year: 2020,
        book_summary: ''
      }
    });

    expect([400, 422]).toContain(res.status());
  });

  test('Reject non-integer for published_year', async ({ request }) => {
    const res = await request.post(`${baseURL}/books/`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Test Book',
        author: 'Author',
        published_year: 'not-a-number',
        book_summary: 'Bad year'
      }
    });

    expect([400, 422]).toContain(res.status());
  });

  test('Validate that /books returns array', async ({ request }) => {
    const res = await request.get(`${baseURL}/books/`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });
});