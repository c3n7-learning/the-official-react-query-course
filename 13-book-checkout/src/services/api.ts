import type { Book } from "../types/book";

const BASE_URL = "https://library-api.uidotdev.workers.dev";

export async function getBook(bookId: string): Promise<Book> {
  const url = `${BASE_URL}/books/${bookId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}

export async function getMyBooks(): Promise<Book[]> {
  const url = `${BASE_URL}/books/my-books`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}


interface GenericResponse {
  message: string;
}

export async function checkoutBook(bookId: string): Promise<GenericResponse> {
  const url = `${BASE_URL}/checkout/${bookId}`;

  const response = await fetch(url, { method: 'POST' });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}

export async function returnBook(bookId: string): Promise<GenericResponse> {
  const url = `${BASE_URL}/return/${bookId}`;

  const response = await fetch(url, { method: 'POST' });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}


