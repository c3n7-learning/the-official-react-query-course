import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBook, getBooksViaSearch } from "./api";


export const getBooksSearchQuery = (query: string) => queryOptions({
  queryKey: ["search", { query }],
  queryFn: () => getBooksViaSearch(query),
  staleTime: Infinity,
});

export function useSearch(query: string) {
  return useQuery(getBooksSearchQuery(query));
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
