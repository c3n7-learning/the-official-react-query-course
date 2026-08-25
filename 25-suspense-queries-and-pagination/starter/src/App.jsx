import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchRepoList } from "./api";

function useRepos(sort) {
  return useQuery({
    queryKey: ["repos", sort],
    queryFn: () => fetchRepoList(sort),
    staleTime: 30_000,
  });
}

export default function App() {
  const [sort, setSort] = useState("stars");
  const reposQuery = useRepos(sort);

  return (
    <main className="page">
      <h1>Suspense Search and Pagination</h1>
      <label>
        Sort
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="stars">Stars</option>
          <option value="updated">Updated</option>
          <option value="full_name">Name</option>
        </select>
      </label>

      {/* TODO: refactor this screen to Suspense + ErrorBoundary */}
      {reposQuery.isPending ? <p>Loading repos...</p> : null}
      {reposQuery.isError ? <p>Something went wrong.</p> : null}
      <ul className="list">
        {reposQuery.data?.map((repo) => (
          <li key={repo.id}>
            <strong>{repo.name}</strong>
            <span>{repo.stargazers_count} stars</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
