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
