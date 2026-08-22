import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

const queryClient = new QueryClient();

export interface BookT {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string; // ISO date string (YYYY-MM-DD)
  description: string; // HTML formatted string
  thumbnail: string; // URL string
  previewLink: string; // URL string
  averageRating: number;
  availableCopies: number;
  isCheckedOutByUser: boolean;
}

interface ReviewT {
  reviewId: number;
  userId: string;
  bookId: string;
  rating: number;
  title: string;
  text: string;
  reviewDate: string; // ISO 8601 date string
  canEdit: boolean;
}

const BASE_URL = "https://library-api.uidotdev.workers.dev";

async function getReviewData(reviewId: string): Promise<ReviewT> {
  const url = `${BASE_URL}/review/${reviewId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}

async function getBookData(bookId: string): Promise<BookT> {
  const url = `${BASE_URL}/books/${bookId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}

function useReview(reviewId: string) {
  return useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => getReviewData(reviewId),
  });
}

function useBook(bookId: string | undefined) {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBookData(bookId!),
    enabled: bookId !== undefined,
  });
}

function useBookReview(reviewId: string) {
  const review = useReview(reviewId);
  const book = useBook(review.data?.bookId);

  return { review, book };
}

function Book({ reviewId }: { reviewId: string }) {
  const { review, book } = useBookReview(reviewId);

  if (review.isPending) {
    return <Loading />;
  }

  if (review.isError) {
    return <ErrorCmp />;
  }

  return (
    <>
      <div className="d-flex gap-2 align-items-start">
        {book.isSuccess ? (
          <img
            src={book.data.thumbnail}
            style={{ width: "18rem" }}
            className="card-img-top rounded"
            alt="..."
          />
        ) : (
          <div
            style={{ width: "18rem", height: "30rem" }}
            className="border rounded"
          ></div>
        )}

        <div className="card" style={{ maxWidth: "640px" }}>
          <div className="card-body">
            <h5 className="card-title">{review.data.title} </h5>
            <p className="card-text">
              {book.isSuccess ? (
                <small className="text-body-secondary">
                  {book.data.authors.join(", ")} {"  "}(
                  {book.data.averageRating})
                </small>
              ) : (
                <small>...</small>
              )}
            </p>
            <div className="card-text">{review.data.text}</div>
          </div>
        </div>
      </div>
    </>
  );
}

function Loading() {
  return <main>Loading...</main>;
}

function ErrorCmp() {
  return <main>Woops there was an error...</main>;
}

function App() {
  const [reviewId, setReviewId] = useState("2");

  return (
    <QueryClientProvider client={queryClient}>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Query Library</span>

          <select
            className="form-select"
            style={{ width: "18rem" }}
            value={reviewId}
            onChange={(e) => setReviewId(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      </nav>

      <div className="container pt-4 d-flex flex-column gap-2">
        <Book reviewId={reviewId} />
      </div>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
