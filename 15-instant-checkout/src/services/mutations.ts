import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutBook, returnBook } from "./api";
import { getBookQueryOptions, getMyBooksQueryOptions } from "./queries";
import type { Book } from "../types/book";

export function useCheckoutBook(book: Book) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => checkoutBook(book.id),
    onMutate: async () => {
      // Clear any ongoing queries first
      await queryClient.cancelQueries({ queryKey: ["books"] });

      // Take snapshots
      const bookKey = getBookQueryOptions(book.id).queryKey;
      const bookSnapshot = queryClient.getQueryData(bookKey);

      const myBooksKey = getMyBooksQueryOptions().queryKey;
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
      return queryClient.invalidateQueries({ queryKey: ["books"] });
    }
  })
}

export function useReturnBook(book: Book) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => returnBook(book.id),
    onMutate: async () => {
      // Clear any ongoing queries first
      await queryClient.cancelQueries({ queryKey: ["books"] });

      // Take snapshots
      const bookKey = getBookQueryOptions(book.id).queryKey;
      const bookSnapshot = queryClient.getQueryData(bookKey);

      const myBooksKey = getMyBooksQueryOptions().queryKey;
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
      return queryClient.invalidateQueries({ queryKey: ["books"] });
    }
  })
}
