import { Fragment } from "react/jsx-runtime";
import { useDebounce } from "@uidotdev/usehooks";
import { ErrorMessage, NoResults, Searching } from "./message-components";
import ResultList from "./result-list";
import { getBooksSearchQuery, useSearch } from "../services/queries";
import { useQueryClient } from "@tanstack/react-query";

const Results = ({
  term,
  setBookId,
}: {
  term: string;
  setBookId: (id: string) => void;
}) => {
  const { data, isLoading, isSuccess, isError } = useSearch(term);

  if (isError) {
    return <ErrorMessage />;
  }

  if (isLoading) {
    return <Searching />;
  }

  if (!isSuccess) {
    return <ErrorMessage />;
  }

  if (!data || data.books.length === 0) {
    return <NoResults />;
  }

  return (
    <ResultList searchTerm={term} data={data.books} onClickBook={setBookId} />
  );
};

export default function BookList({
  setBookId,
  term,
  setTerm,
}: {
  setBookId: (id: string) => void;
  term: string;
  setTerm: (v: string) => void;
}) {
  const debouncedTerm = useDebounce(term, 300);

  return (
    <div>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand">QueryLibrary</a>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </form>
        </div>
      </nav>

      <div className="container py-4">
        <PopularSearchTerms
          currentTerm={term}
          setCurrentTerm={(v) => setTerm(v)}
        />

        <Results term={debouncedTerm} setBookId={setBookId} />
      </div>
    </div>
  );
}

const popularTerms = ["Westeros", "Potter", "Martin", "Endeavor"];

function PopularSearchTerms({
  currentTerm,
  setCurrentTerm,
}: {
  currentTerm: string;
  setCurrentTerm: (v: string) => void;
}) {
  const queryClient = useQueryClient();

  const prefetch = (term: string) => {
    queryClient.prefetchQuery(getBooksSearchQuery(term));
  };

  return (
    <div className="d-flex justify-content-end">
      <div className="d-flex flex-column">
        <small className="text-body-secondary mb-1">
          Popular search terms...
        </small>

        <div
          className="btn-group"
          role="group"
          aria-label="Basic radio toggle button group"
        >
          {popularTerms.map((term) => (
            <Fragment key={term}>
              <input
                type="radio"
                className="btn-check"
                name="btnradio"
                autoComplete="off"
                checked={term === currentTerm}
                onChange={() => setCurrentTerm(term)}
              />

              <label
                className="btn btn-outline-secondary"
                onClick={() => setCurrentTerm(term)}
                onMouseEnter={() => prefetch(term)}
              >
                {term}
              </label>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
