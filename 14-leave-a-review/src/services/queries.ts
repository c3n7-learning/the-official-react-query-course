import { useQuery } from "@tanstack/react-query";
import { getBook, getMyBooks, getReviews } from "./api";

export function useBook(bookId: string) {
  return useQuery({
    queryKey: ["books", 'detail', bookId],
    queryFn: () => getBook(bookId),
    staleTime: 5_000,
  });
}

export function useMyBooks() {
  return useQuery({
    queryKey: ["books", 'my-books'],
    queryFn: () => getMyBooks(),
    staleTime: 5_000,
  });
}

export function useBookReviews(bookId: string) {
  return useQuery({
    queryKey: ["books", 'reviews', bookId],
    queryFn: () => getReviews(bookId),
    staleTime: 5_000,
  });
}


