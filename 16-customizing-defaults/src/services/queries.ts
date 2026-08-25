import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { getActivities } from "./api";
import type { BookT, SearchResponse } from '../types/book';
import type { Review } from "../types/review";


export const getBooksSearchQuery = (query: string, page: number = 1) => queryOptions<SearchResponse>({
  queryKey: ["books", "search", `?q=${encodeURI(query)}&page=${page}`],
  placeholderData: (previousData) => previousData,
});

export function useSearch(query: string, page: number = 1) {
  return useQuery(getBooksSearchQuery(query, page));
}

export function useSearchPrefetch() {
  const queryClient = useQueryClient();

  const prefetch = (query: string) => queryClient.prefetchQuery(getBooksSearchQuery(query));

  return { prefetch };
}

export function getFeaturedBooksQuery() {
  return queryOptions<BookT[]>({
    queryKey: ["books", "featured"],
  });
}
export function useFeaturedBooks() {
  return useQuery(getFeaturedBooksQuery())
}

export function useBook(bookId: string, searchTerm: string) {
  const queryClient = useQueryClient();

  return useQuery<BookT>({
    queryKey: ["books", bookId],
    initialData: () => {
      let data = queryClient
        .getQueryData(getBooksSearchQuery(searchTerm).queryKey)
        ?.books.find((book) => book.id === bookId);

      if (data) {
        return data;
      }

      data = queryClient
        .getQueryData(getFeaturedBooksQuery().queryKey)
        ?.find((book) => book.id === bookId);

      return data
    }
  });
}

export function useLatestReview() {
  return useQuery<Review>({
    queryKey: ["reviews", "latest"],
  })
}

export function useReviewsForBook(bookId: string) {
  return useQuery({
    queryKey: ["reviews", bookId],
  })
}

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => getActivities(),
  })
}
