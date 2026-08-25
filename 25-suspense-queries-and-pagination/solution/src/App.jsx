import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState, useTransition } from "react";
import { fetchRepoList } from "./api";

function useRepos(sort) {
  return useSuspenseQuery({
    queryKey: ["repos", sort],
    queryFn: () => fetchRepoList(sort),
    staleTime: 30_000,
  });
}

function RepoList({ sort }) {
  const reposQuery = useRepos(sort);

  return (
    <ul className="list">
      {reposQuery.data.map((repo) => (
        <li key={repo.id}>
          <strong>{repo.name}</strong>
          <span>{repo.stargazers_count} stars</span>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [sort, setSort] = useState("stars");
  const [isPending, startTransition] = useTransition();

  return (
    <main className="page">
      <h1>Suspense Search and Pagination</h1>
      <label>
        Sort
        <select
          value={sort}
          onChange={(event) => startTransition(() => setSort(event.target.value))}
        >
          <option value="stars">Stars</option>
          <option value="updated">Updated</option>
          <option value="full_name">Name</option>
        </select>
      </label>
      {isPending ? <p>Updating...</p> : null}
      <Suspense fallback={<p>Loading repos...</p>}>
        <RepoList sort={sort} />
      </Suspense>
    </main>
  );
}
