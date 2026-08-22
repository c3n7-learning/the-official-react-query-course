import {
  QueryClient,
  QueryClientProvider,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

const queryClient = new QueryClient();

export interface Book {
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
  thumbnail: string;
  reviewDate: string; // ISO 8601 date string
  canEdit: boolean;
}

const BASE_URL = "https://library-api.uidotdev.workers.dev";

async function getReviews(bookId: string): Promise<ReviewT[]> {
  const url = `${BASE_URL}/reviews/${bookId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}

async function getBook(bookId: string): Promise<Book> {
  const url = `${BASE_URL}/books/${bookId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}

function useBook(bookId: string) {
  return useQuery({
    queryKey: ["book", { bookId }],
    queryFn: () => getBook(bookId),
    staleTime: 5_000,
  });
}

function useReviews(bookId: string) {
  return useQuery({
    queryKey: ["reviews", { bookId }],
    queryFn: () => getReviews(bookId),
    staleTime: 5_000,
  });
}

function useBookDetails(bookId: string) {
  return useQueries({
    queries: [
      {
        queryKey: ["book", { bookId }],
        queryFn: () => getBook(bookId),
      },
      {
        queryKey: ["reviews", { bookId }],
        queryFn: () => getReviews(bookId),
      },
    ],

    combine: (queries) => ({
      isPending: queries.some((q) => q.isPending),
      isError: queries.some((q) => q.isError),
      book: queries[0].data,
      reviews: queries[1].data,
    }),
  });
}

function Book({ bookId }: { bookId: string }) {
  const { book, reviews, isPending, isError } = useBookDetails(bookId);

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorCmp />;
  }

  return (
    <>
      <div className="d-flex gap-2 align-items-start">
        <img
          src={book!.thumbnail}
          style={{ width: "18rem" }}
          className="card-img-top rounded"
          alt="..."
        />

        <div className="d-flex flex-column">
          <div className="card" style={{ maxWidth: "640px" }}>
            <div className="card-body">
              <h5 className="card-title">{book!.title} </h5>
              <p className="card-text">
                <small className="text-body-secondary">
                  {book!.authors.join(", ")} {"  "}({book!.averageRating})
                </small>
              </p>
              <div className="card-text">
                <div dangerouslySetInnerHTML={{ __html: book!.description }} />
              </div>
            </div>
          </div>

          {reviews!.map((review) => (
            <div
              key={review.reviewId}
              className="card mt-2"
              style={{ maxWidth: "640px" }}
            >
              <div className="card-body">
                <div className="card-title">
                  {review.title} {"  "}
                  <small className="text-body-secondary">
                    ({review.rating} / 5)
                  </small>
                </div>
                <div className="card-text"></div>
                <div className="card-text">{review.text}</div>
              </div>
            </div>
          ))}
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
  const [selectedBookId, setSelectedBookId] = useState("pD6arNyKyi8C");
  return (
    <QueryClientProvider client={queryClient}>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Query Library</span>

          <select
            className="form-select"
            style={{ width: "18rem" }}
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
          >
            <option value="pD6arNyKyi8C">The Hobbit</option>
            <option value="aWZzLPhY4o0C">The Fellowship Of The Ring</option>
            <option value="12e8PJ2T7sQC">The Two Towers</option>
            <option value="WZ0f_yUgc0UC">The Return Of The King</option>
          </select>
        </div>
      </nav>

      <div className="container pt-4 d-flex flex-column gap-2">
        <Book bookId={selectedBookId} />
      </div>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
