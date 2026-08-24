import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutBook, returnBook, submitReview } from "./api";
import type { ReviewForm } from "../types/review";


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


export function useLeaveAReview(bookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: ReviewForm) => submitReview({ bookId, review }),
    onSuccess: () => {
      console.log('useLeaveAReview');
      return queryClient.invalidateQueries({ queryKey: ["books", "reviews", bookId] });
    }
  })
}
