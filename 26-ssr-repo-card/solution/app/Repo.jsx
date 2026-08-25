"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRepoData } from "./api";

export default function Repo() {
  const { data } = useQuery({
    queryKey: ["repoData"],
    queryFn: fetchRepoData,
    staleTime: 10_000,
  });

  return (
    <>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>Stars: {data.stargazers_count}</strong>
    </>
  );
}
