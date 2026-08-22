import {
  QueryClient,
  QueryClientProvider,
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

const BASE_URL = "https://library-api.uidotdev.workers.dev";

async function getData(bookId: string): Promise<Book> {
  const url = `${BASE_URL}/books/${bookId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}

function useBook(bookId: string) {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getData(bookId),
    staleTime: 5_000,
  });
}

function Book({ bookId }: { bookId: string }) {
  const { data, isPending, isError, isStale, isFetching, refetch } =
    useBook(bookId);

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
          src={data.thumbnail}
          style={{ width: "18rem" }}
          className="card-img-top rounded"
          alt="..."
        />

        <div className="card" style={{ maxWidth: "640px" }}>
          <div className="card-body">
            <h5 className="card-title">{data.title} </h5>
            <p className="card-text">
              <small className="text-body-secondary">
                {data.authors.join(", ")} {"  "}({data.averageRating})
              </small>
            </p>
            <div className="border rounded w-100 py-2 px-2">
              {isFetching ? (
                <BackgroundUpdateInProgress />
              ) : (
                <button className="btn btn-primary w-100">Checkout</button>
              )}
              {isStale ? (
                <div className="d-flex align-items-center justify-content-center">
                  <small className="pt-1">
                    The checkout status may have changed...{" "}
                  </small>
                  <button className="btn btn-link" onClick={() => refetch()}>
                    <small>Get the latest data</small>
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center">
                  <small className="pt-2">
                    Everything is up to date - go ahead and checkout that book!
                  </small>
                </div>
              )}
            </div>
            <div className="card-text">
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function BackgroundUpdateInProgress() {
  return (
    <button className="btn btn-primary w-100" type="button" disabled>
      <span className="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
      <span className="ms-2" role="status">
        Loading...
      </span>
    </button>
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
