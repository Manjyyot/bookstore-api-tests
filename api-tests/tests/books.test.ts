import { test, expect } from '@playwright/test';
import { newBook, updatedBook } from '../data/book.data';
import { getAuthToken } from '../utils/auth.helper';
import { baseURL } from '../config/env.config';

test.describe('Books API - CRUD Operations & Validations', () => {
  let token: string;

  test.beforeAll(async () => {
    token = await getAuthToken();
  });

  test('Full Book Lifecycle', async ({ request }) => {
    // 1. Create Book
    const create = await request.post(`${baseURL}/books/`, {
      headers: { Authorization: `Bearer ${token}` },
      data: newBook
    });

    expect(create.status(), 'Create book failed').toBe(200);
    const created = await create.json();
    const bookId = created.id;
    expect(created.name).toBe(newBook.name);

    // 2. Get Book by ID
    const get = await request.get(`${baseURL}/books/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(get.status(), 'Get book by ID failed').toBe(200);
    const fetched = await get.json();
    expect(fetched.id).toBe(bookId);

    // 3. Update Book
    const update = await request.put(`${baseURL}/books/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: updatedBook
    });

    let updateBody: any = {};
    try {
      updateBody = await update.json();
    } catch {
      const fallback = await update.text();
      console.error('Update book failed with raw response:', fallback);
    }

    console.log('Update book response:', updateBody);
    expect(update.status(), 'Update book failed').toBe(200);
    expect(updateBody.name).toBe(updatedBook.name);

    // 4. List All Books
    const list = await request.get(`${baseURL}/books/`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(list.status(), 'List all books failed').toBe(200);
    const books = await list.json();
    expect(Array.isArray(books)).toBe(true);

    // 5. Delete Book
    const del = await request.delete(`${baseURL}/books/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(del.status(), 'Delete book failed').toBe(200);
    const delBody = await del.json();
    expect(delBody.message).toContain('deleted');

    // 6. Confirm Deletion
    const checkDel = await request.get(`${baseURL}/books/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(checkDel.status(), 'Deleted book should return 404').toBe(404);
  });

  test('Should reject book creation without token', async ({ request }) => {
    const res = await request.post(`${baseURL}/books/`, {
      data: newBook
    });

    expect(res.status(), 'Expected 403 when token is missing').toBe(403);
  });

  test('Should return error on creating book with missing fields', async ({ request }) => {
    const res = await request.post(`${baseURL}/books/`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: 'Only Name' } // Missing required fields
    });

    const status = res.status();
    try {
      const body = await res.json();
      console.log('Create book with missing fields response:', body);
    } catch {
      const text = await res.text();
      console.warn('Non-JSON response for missing fields:', text);
    }

    expect([422, 500]).toContain(status);
  });

  test('Should return 404 when deleting non-existent book', async ({ request }) => {
    const res = await request.delete(`${baseURL}/books/99999`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(res.status(), 'Expected 404 for deleting non-existent book').toBe(404);
  });
});
