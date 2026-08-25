import { queryOptions, useQuery } from "@tanstack/react-query";
import { getBook, getMyBooks } from "./api";

export const getBookQueryOptions = (bookId: string) => queryOptions({
  queryKey: ["books", 'detail', bookId],
  queryFn: () => getBook(bookId),
  staleTime: 5_000,
});

export function useBook(bookId: string) {
  return useQuery(getBookQueryOptions(bookId));
}

export const getMyBooksQueryOptions = () => queryOptions({
  queryKey: ["books", 'my-books'],
  queryFn: () => getMyBooks(),
  staleTime: 5_000,
});

export function useMyBooks() {
  return useQuery(getMyBooksQueryOptions());
}
