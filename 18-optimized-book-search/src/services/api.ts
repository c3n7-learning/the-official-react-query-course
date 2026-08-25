import type { BookT } from "../types/book";

const BASE_URL = "https://library-api.uidotdev.workers.dev";

export async function getBook(bookId: string): Promise<BookT> {
  const url = `${BASE_URL}/books/${bookId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}

type ResponseT = {
  books: BookT[];
  currentPage: number;
  totalPages: number;
};

export async function getBooksViaSearch(query: string, page: number, abortSignal: AbortSignal): Promise<ResponseT> {
  const url = `${BASE_URL}/books/search?q=${query}&page=${page}`;

  const response = await fetch(url, { signal: abortSignal });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}


