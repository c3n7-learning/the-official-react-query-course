import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkoutBook, getBook, getMyBooks, returnBook } from "./api";

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

export function useCheckoutBook(bookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => checkoutBook(bookId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["books"] });
    }
  })
}

export function useReturnBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: returnBook,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["books"] });
    }
  })
}
