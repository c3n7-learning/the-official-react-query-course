import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { useBook, useBookReviews } from "./services/queries";
import { useLeaveAReview } from "./services/mutations";
import type { ReviewForm } from "./types/review";

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
            <div
              className="card-text"
              style={{ maxHeight: "15rem", overflowY: "scroll" }}
            >
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            </div>

            <ReviewForm bookId={bookId} />
          </div>
        </div>
      </div>

      <Reviews bookId={bookId} />
    </div>
  );
}

function ReviewForm({ bookId }: { bookId: string }) {
  const [rating, setRating] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const { mutate, isPending } = useLeaveAReview(bookId);

  function submit() {
    const body = { title, text, rating: Number(rating) };
    mutate(body, {
      onSuccess: () => {
        console.log("ReviewForm");
        setRating("");
        setTitle("");
        setText("");
        setError("");
      },
      onError: (e) => {
        setError(e.message);
      },
    });
  }

  return (
    <form>
      <div className="mb-3 fs-6 fw-bold pt-4">Your Review</div>

      <div className="d-flex gap-2">
        {Array(5)
          .fill("-")
          .map((_, id) => (
            <div className="form-check" key={id}>
              <input
                className="form-check-input"
                type="radio"
                name="radioDefault"
                checked={rating === `${id + 1}`}
                value={id + 1}
                onChange={(e) => setRating(e.target.value)}
              />
              <label className="form-check-label">{id + 1}</label>
            </div>
          ))}
      </div>

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          id="title"
          placeholder="Give your review title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Review</label>
        <textarea
          className="form-control"
          id="review"
          placeholder="What did you think?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        ></textarea>
      </div>
      {error.length ? (
        <div className="mb-3 fs-6">
          <small className="text-danger">{error}</small>
        </div>
      ) : (
        <></>
      )}
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary"
          type="button"
          onClick={submit}
          disabled={isPending}
        >
          {isPending && (
            <span
              className="spinner-grow spinner-grow-sm"
              aria-hidden="true"
            ></span>
          )}

          <span className="ms-3">Submit</span>
        </button>
      </div>
    </form>
  );
}

function Reviews({ bookId }: { bookId: string }) {
  const { data, isPending, isError } = useBookReviews(bookId);

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorCmp />;
  }

  return data.map((review) => (
    <div className="card" key={review.reviewId}>
      <div className="card-header d-flex justify-content-between">
        <span>
          {review.rating}/5: {review.title}
        </span>
        <span>
          {new Date(review.reviewDate).toLocaleDateString()}{" "}
          {new Date(review.reviewDate).toLocaleTimeString()}
        </span>
      </div>
      <div className="card-body">
        <figure>
          <blockquote className="blockquote fs-6">
            <p>{review.text}</p>
          </blockquote>
          <figcaption className="blockquote-footer">By Anonymous</figcaption>
        </figure>
      </div>
    </div>
  ));
}

function Loading() {
  return <main>Loading...</main>;
}

function ErrorCmp() {
  return <main>Woops there was an error...</main>;
}

function App() {
  const [selectedBookId, setSelectedBookId] = useState("784jmkJj7lcC");
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
            <option value="784jmkJj7lcC">Featured Player</option>
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
