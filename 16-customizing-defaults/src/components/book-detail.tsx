import { ChevronLeft } from "lucide-react";
import { useBook } from "../services/queries";
import BookReview from "./book-reviews";

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
            <h5 className="card-title">
              {data.title} {isPlaceholderData ? " <>" : ""}
            </h5>
            <p className="card-text">
              <small className="text-body-secondary">
                {data.authors.join(", ")} {"  "}({data.averageRating})
              </small>
            </p>
            <div className="card-text">
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            </div>
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
