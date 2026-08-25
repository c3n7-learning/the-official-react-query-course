import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutBook, returnBook } from "./api";
import type { BookT } from "../types/book";
import { bookQueries } from "./options";

export function useCheckoutBook(book: BookT) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => checkoutBook(book.id),
    onMutate: async () => {
      // Clear any ongoing queries first
      await queryClient.cancelQueries(bookQueries.all());

      // Take snapshots
      const bookKey = bookQueries.detail(book.id).queryKey;
      const bookSnapshot = queryClient.getQueryData(bookKey);

      const myBooksKey = bookQueries.myBooks().queryKey;
      const myBooksSnapshot = queryClient.getQueryData(bookKey);

      // Optimistically update the cache
      queryClient.setQueryData(
        bookKey,
        (previous) => previous ? ({ ...previous, isCheckedOutByUser: true, availableCopies: previous.availableCopies - 1 }) : undefined
      );

      queryClient.setQueryData(
        myBooksKey,
        (previous) => [...(previous ?? []), { ...book }]
      );

      // Now return a rollback function in case things go south
      return () => {
        if (bookSnapshot) {
          queryClient.setQueryData(bookKey, bookSnapshot);
        }


        if (myBooksSnapshot) {
          queryClient.setQueryData(bookKey, myBooksSnapshot);
        }
      }
    },
    onError: (_, __, rollback) => {
      rollback?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries(bookQueries.all());
    }
  })
}

export function useReturnBook(book: BookT) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => returnBook(book.id),
    onMutate: async () => {
      // Clear any ongoing queries first
      await queryClient.cancelQueries(bookQueries.all());

      // Take snapshots
      const bookKey = bookQueries.detail(book.id).queryKey;
      const bookSnapshot = queryClient.getQueryData(bookKey);

      const myBooksKey = bookQueries.myBooks().queryKey;
      const myBooksSnapshot = queryClient.getQueryData(bookKey);

      // Optimistically update the cache
      queryClient.setQueryData(
        bookKey,
        (previous) => previous ? ({ ...previous, isCheckedOutByUser: false, availableCopies: previous.availableCopies + 1 }) : undefined
      );

      queryClient.setQueryData(
        myBooksKey,
        (previous) => [...(previous ?? [])].filter((b) => b.id !== book.id),
      );

      // Now return a rollback function in case things go south
      return () => {
        if (bookSnapshot) {
          queryClient.setQueryData(bookKey, bookSnapshot);
        }


        if (myBooksSnapshot) {
          queryClient.setQueryData(bookKey, myBooksSnapshot);
        }
      }
    },
    onError: (_, __, rollback) => {
      rollback?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries(bookQueries.all());
    }
  })
}

