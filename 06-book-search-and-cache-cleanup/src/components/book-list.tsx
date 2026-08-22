import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useDebounce } from "@uidotdev/usehooks";
import type { BookT } from "./book-detail";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage, NoResults, Searching } from "./message-components";
import ResultList from "./result-list";

const BASE_URL = "https://library-api.uidotdev.workers.dev";

type ResponseT = {
  books: BookT[];
};

async function getData(query: string): Promise<ResponseT> {
  const url = `${BASE_URL}/books/search?q=${query}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}

function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => getData(query),
    staleTime: 5_000,
    gcTime: 5_000,
  });
}

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

  if (data.books.length === 0) {
    return <NoResults />;
  }

  return (
    <ResultList searchTerm={term} data={data.books} onClickBook={setBookId} />
  );
};

export default function BookList({
  setBookId,
}: {
  setBookId: (id: string) => void;
}) {
  const [term, setTerm] = useState("Westeros");
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

const popularTerms = ["Westeros", "Harry", "Hobbit", "Endeavor"];

function PopularSearchTerms({
  currentTerm,
  setCurrentTerm,
}: {
  currentTerm: string;
  setCurrentTerm: (v: string) => void;
}) {
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
