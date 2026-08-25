import { ChevronLeft } from "lucide-react";
import { useBook } from "../services/queries";
import BookReview from "./book-reviews";
import MyBooks from "./my-books";
import { useCheckoutBook, useReturnBook } from "../services/mutations";
import type { BookT } from "../types/book";

function Book({ bookId, searchTerm }: { bookId: string; searchTerm: string }) {
  const { data, isPending, isError, isPlaceholderData } = useBook(
    bookId,
    searchTerm,
  );

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
            <h5 className="card-title">
              {data.title} {isPlaceholderData ? " <>" : ""}
            </h5>
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
  const { mutate, isPending } = useCheckoutBook(book);

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

function ReturnButton({ book }: { book: BookT }) {
  const { mutate, isPending } = useReturnBook(book);

  return (
    <div className="border rounded w-100 py-2 px-2">
      <button
        className="btn btn-outline-primary w-100"
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

export default function BookDetail({
  bookId,
  searchTerm,
  onClickBack,
}: {
  bookId: string;
  onClickBack: () => void;
  searchTerm: string;
}) {
  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <button
            onClick={onClickBack}
            className="btn btn-link d-flex align-items-center mb-0 h1"
          >
            <ChevronLeft /> <span>back</span>
          </button>
        </div>
      </nav>

      <div className="container pt-4 d-flex flex-column gap-2">
        <Book bookId={bookId} searchTerm={searchTerm} />
      </div>

      <BookReview bookId={bookId} />
    </>
  );
}
