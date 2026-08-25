import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import z from "zod";

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
  random: string;
}

const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  authors: z.array(z.string()),
  publisher: z.string(),
  publishedDate: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  previewLink: z.string(),
  averageRating: z.number(),
  availableCopies: z.number(),
  isCheckedOutByUser: z.boolean(),
  random: z.string(),
});

const BASE_URL = "https://library-api.uidotdev.workers.dev";

async function getData(bookId: string): Promise<Book> {
  const url = `${BASE_URL}/books/${bookId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data = await response.json();

  return bookSchema.parse(data);
}

function useBook(bookId: string) {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getData(bookId),
    retry: (failureCount, error) => {
      if (error instanceof z.ZodError) {
        return false;
      }

      return failureCount < 3;
    },
    throwOnError: true,
  });
}

function Book({ bookId }: { bookId: string }) {
  const { data, isPending, isError } = useBook(bookId);

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorCmp />;
  }

  return (
    <div className="card" style={{ width: "18rem" }}>
      <img src={data.thumbnail} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{data.title}</h5>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">{data.authors.join(", ")}</li>
      </ul>
    </div>
  );
}

function Loading() {
  return <main>Loading...</main>;
}

function ErrorCmp() {
  return <main>Woops there was an error...</main>;
}

function ErrorFallback({
  reset,
  error,
}: {
  error?: string | undefined;
  reset: () => void;
}) {
  return (
    <div className="alert alert-warning d-flex align-items-center" role="alert">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        width="24"
        height="24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>

      <div className="d-flex justify-content-between w-100 align-items-center">
        <div className="flex-grow-1">
          {" "}
          {error ?? "Uh oh! There was an error."}'
        </div>
        <button className="btn btn-sm btn-warning" onClick={reset}>
          Retry
        </button>
      </div>
    </div>
  );
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
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              resetKeys={[selectedBookId]}
              fallbackRender={({ error, resetErrorBoundary }) => (
                <ErrorFallback
                  reset={() => resetErrorBoundary()}
                  error={
                    error instanceof z.ZodError
                      ? error.issues[0].message
                      : undefined
                  }
                />
              )}
            >
              <Book bookId={selectedBookId} />
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
