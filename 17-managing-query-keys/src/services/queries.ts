import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getActivities } from "./api";
import { reviewQueries } from "./options";
import { bookQueries } from "./options";


export function useSearch(query: string, page: number = 1) {
  return useQuery(bookQueries.search(query, page));
}

export function useSearchPrefetch() {
  const queryClient = useQueryClient();

  return {
    prefetch: (query: string) => queryClient.prefetchQuery(bookQueries.search(query))
  };
}

export function useFeaturedBooks() {
  return useQuery(bookQueries.featured())
}

export function useMyBooks() {
  return useQuery(bookQueries.myBooks())
}

export function useBook(bookId: string, searchTerm: string) {
  const queryClient = useQueryClient();

  return useQuery({
    ...bookQueries.detail(bookId),
    initialData: () => {
      let data = queryClient
        .getQueryData(bookQueries.search(searchTerm).queryKey)
        ?.books.find((book) => book.id === bookId);

      if (data) {
        return data;
      }

      data = queryClient
        .getQueryData(bookQueries.featured().queryKey)
        ?.find((book) => book.id === bookId);

      return data
    }
  });
}

export function useLatestReview() {
  return useQuery(reviewQueries.latest())
}

export function useReviewsForBook(bookId: string) {
  return useQuery(reviewQueries.detail(bookId))
}

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => getActivities(),
  })
}
