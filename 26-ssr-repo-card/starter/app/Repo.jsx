"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRepoData } from "./api";

export default function Repo() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["repoData"],
    queryFn: fetchRepoData,
    staleTime: 10_000,
  });

  if (isPending) return <p>Loading repo...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>Stars: {data.stargazers_count}</strong>
    </>
  );
}
