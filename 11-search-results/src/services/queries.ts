import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBook, getBooksViaSearch } from "./api";


export const getBooksSearchQuery = (query: string, page: number = 1) => queryOptions({
  queryKey: ["search", { query, page }],
  queryFn: () => getBooksViaSearch(query, page),
  staleTime: Infinity,
  placeholderData: (previousData) => previousData,
});

export function useSearch(query: string, page: number = 1) {
  return useQuery(getBooksSearchQuery(query, page));
}


export function useBook(bookId: string, searchTerm: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBook(bookId),
    staleTime: Infinity,
    initialData: () => {
      const data = queryClient
        .getQueryData(getBooksSearchQuery(searchTerm).queryKey)
        ?.books.find((book) => book.id === bookId);

      return data
    }
  });
}
