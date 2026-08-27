import { QueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import React, { useState, useTransition } from "react";
import { fetchRepoList } from "./api";
import { ErrorBoundary } from "react-error-boundary";

function useRepos(sort) {
  return useSuspenseQuery({
    queryKey: ["repos", sort],
    queryFn: () => fetchRepoList(sort),
    staleTime: 30_000,
    retry: 1,
  });
}

function ErrorFallback({ resetErrorBoundary }) {
  return <div className="error">
    <p>
      Uh Oh! Something went wrong
    </p>

    <button onClick={resetErrorBoundary}>Retry</button>
  </div>
}

export default function App() {
  const [sort, setSort] = useState("stars");
  const [isPreviousData, startTransition] = useTransition();

  return (
    <main className="page">
      <h1>Suspense Search and Pagination</h1>
      <label>
        Sort
        <select value={sort} onChange={(e) => {
          startTransition(() => setSort(e.target.value))
        }}>
          <option value="stars">Stars</option>
          <option value="updated">Updated</option>
          <option value="full_name">Name</option>
        </select>
      </label>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
            <React.Suspense fallback={<p>Loading the repos...</p>}>
              <Repos sort={sort} isPreviousData={isPreviousData} />
            </React.Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </main>
  );
}

function Repos({ sort, isPreviousData }) {
  const reposQuery = useRepos(sort);

  return (
    <ul className="list" style={{ opacity: isPreviousData ? 0.5 : 1 }}>
      {reposQuery.data.map((repo) => (
        <li key={repo.id}>
          <strong>{repo.name}</strong>
          <span>{repo.stargazers_count} stars</span>
        </li>
      ))}
    </ul>
  )

}
