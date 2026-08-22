import { Fragment } from "react/jsx-runtime";
import { useDebounce } from "@uidotdev/usehooks";
import { ErrorMessage, NoResults, Searching } from "./message-components";
import ResultList from "./result-list";
import { getBooksSearchQuery, useSearch } from "../services/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const Results = ({
  term,
  setBookId,
  page,
  setPage,
}: {
  term: string;
  setBookId: (id: string) => void;
  page: number;
  setPage: (page: number) => void;
}) => {
  const { data, isLoading, isPlaceholderData, isSuccess, isError } = useSearch(
    term,
    page,
  );

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
    <div style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
      <ResultList
        searchTerm={term}
        data={data.books}
        onClickBook={setBookId}
        page={page}
        setPage={setPage}
      />
    </div>
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
  const [page, setPage] = useState(1);

  return (
    <div>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand">QueryLibrary</a>
          <PopularSearchTerms
            currentTerm={term}
            setCurrentTerm={(v) => setTerm(v)}
          />
        </div>
      </nav>

      <div className="container py-4">
        <Results
          term={debouncedTerm}
          setBookId={setBookId}
          page={page}
          setPage={setPage}
        />
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
