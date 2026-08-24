import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import {
  useBook,
  useCheckoutBook,
  useMyBooks,
  useReturnBook,
} from "./services/queries";
import type { Book as BookT } from "./types/book";

const queryClient = new QueryClient();

function Book({ bookId }: { bookId: string }) {
  const { data, isPending, isError } = useBook(bookId);

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorCmp />;
  }

  return (
    <div className="d-flex flex-column gap-4 mb-4">
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
            {data.isCheckedOutByUser ? (
              <ReturnButton book={data} />
            ) : (
              <CheckoutButton book={data} />
            )}
            <div
              className="card-text"
              style={{ maxHeight: "20rem", overflowY: "scroll" }}
            >
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            </div>
          </div>
        </div>
      </div>

      <MyBooks />
    </div>
  );
}

function CheckoutButton({ book }: { book: BookT }) {
  const { mutate, isPending } = useCheckoutBook(book.id);

  return (
    <div className="border rounded w-100 py-2 px-2">
      <button
        className="btn btn-primary w-100"
        onClick={() => mutate()}
        disabled={isPending}
      >
        {isPending && (
          <span
            className="spinner-grow spinner-grow-sm"
            aria-hidden="true"
          ></span>
        )}
        <span className="ms-2" role="status">
          Checkout
        </span>
      </button>

      <div className="text-center mt-2">
        {book.availableCopies} copies remaining
      </div>
    </div>
  );
}
function MyBooks() {
  const { data, isPending, isError } = useMyBooks();

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorCmp />;
  }

  return (
    <div className="d-flex gap-2">
      {data.map((book) => (
        <div className="card" style={{ width: "9rem" }} key={book.title}>
          <img
            src={book.thumbnail}
            className="card-img-top object-fit-cover"
            style={{ width: "9rem", height: "12rem" }}
            alt={book.title}
          />
          <div className="card-body">
            <h5 className="card-title fs-6">{book.title}</h5>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReturnButton({ book }: { book: BookT }) {
  const { mutate, isPending } = useReturnBook();

  return (
    <div className="border rounded w-100 py-2 px-2">
      <button
        className="btn btn-outline-primary w-100"
        onClick={() => mutate(book.id)}
        disabled={isPending}
      >
        {isPending && (
          <span
            className="spinner-grow spinner-grow-sm"
            aria-hidden="true"
          ></span>
        )}
        <span className="ms-2" role="status">
          Return
        </span>
      </button>

      <div className="text-center mt-2">
        {book.availableCopies} copies remaining
      </div>
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
