export interface BookReview {
  reviewId: number;
  userId: string;
  bookId: string;
  rating: number; // Assumed 1-5 scale
  title: string;
  text: string;
  thumbnail: string;
  reviewDate: string; // ISO 8601 string representation of a Date
  canEdit: boolean;
}

export interface ReviewForm {
  rating: number;
  title: string;
  text: string;
}
