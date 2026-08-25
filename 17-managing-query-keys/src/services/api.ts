import type { QueryFunctionContext } from "@tanstack/react-query";
import type { Activity } from "../types/activity";
import type { BookT } from "../types/book";
import type { Review } from "../types/review";

const BASE_URL = "https://library-api.uidotdev.workers.dev";


export async function defaultQueryFn({ queryKey }: QueryFunctionContext): Promise<unknown> {
  // const path: string = queryKey.join("/");
  let path: string = "";

  const stringKeys = queryKey.filter((key) => typeof key === 'string');

  for (const key of stringKeys) {
    path += key.startsWith("?")
      ? key
      : `/${key}`;
  }

  const url = `${BASE_URL}${path}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}


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

export async function getBooksViaSearch(query: string, page: number): Promise<ResponseT> {
  const url = `${BASE_URL}/books/search?q=${query}&page=${page}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}


export async function getFeaturedBooks(): Promise<BookT[]> {
  const url = `${BASE_URL}/books/featured`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}

export async function getLatestReview(): Promise<Review | null> {
  const url = `${BASE_URL}/reviews`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data: Review[] = await response.json();

  return data[0] || null;
}

export async function getReviewsForBook(bookId: string): Promise<Review[]> {
  const url = `${BASE_URL}/reviews/${bookId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return await response.json();
}


const PER_PAGE = 10;
const MAX_PAGE = 5;

export async function getActivities(page: number = 1): Promise<Activity[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activities = Array(PER_PAGE)
        .fill("-")
        .map((_, id) => {
          const ago = id + page;
          return {
            title: "Someone just joined Query Library",
            done_at: `${ago} hours ago`,
          };
        });
      resolve(page < MAX_PAGE ? activities : []);
    }, 1_000);
  });
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

