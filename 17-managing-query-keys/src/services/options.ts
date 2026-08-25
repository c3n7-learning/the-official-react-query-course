import { queryOptions } from "@tanstack/react-query";
import type { BookT, SearchResponse } from "../types/book";
import type { Review } from "../types/review";

export const bookQueries = {
  all: () => (queryOptions({ queryKey: ["books"] })),
  detail: (bookId: string) => queryOptions<BookT>({
    queryKey: ["books", bookId]
  }),
  featured: () => queryOptions<BookT[]>({
    queryKey: ['books', 'featured'],
  }),
  search: (query: string, page: number = 1) => queryOptions<SearchResponse>({
    queryKey: ['books', 'search', `?q=${encodeURI(query)}&page=${page}`],
    placeholderData: (previousData) => previousData,
  }),
  myBooks: () => queryOptions<BookT[]>({
    queryKey: ['books', 'my-books'],
  })
}

export const reviewQueries = {
  all: () => (queryOptions({ queryKey: ["reviews"] })),
  detail: (bookId: string) => queryOptions<Review[]>({
    queryKey: ["reviews", bookId]
  }),
  latest: () => queryOptions<Review>({
    queryKey: ['reviews', 'latest'],
  }),
}
