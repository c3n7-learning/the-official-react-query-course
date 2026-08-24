import type { Book } from "../types/book";
import type { BookReview, ReviewForm } from "../types/review";

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

export async function getReviews(bookId: string): Promise<BookReview[]> {
  const url = `${BASE_URL}/reviews/${bookId}`;

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

interface ErrorResponse {
  error: string;
}


export async function submitReview({ bookId, review }: { bookId: string; review: ReviewForm }): Promise<GenericResponse> {
  const url = `${BASE_URL}/reviews/${bookId}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(review),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const data = (await response.json()) satisfies ErrorResponse;
    throw new Error(data.error);
  }

  return response.json();
}


