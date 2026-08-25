"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchRepoData } from "./api";

export default function Repo() {
  const { data } = useSuspenseQuery({
    queryKey: ["repoData"],
    queryFn: fetchRepoData,
    staleTime: 10_000,
  });

  return (
    <section>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>Stars: {data.stargazers_count}</strong>
    </section>
  );
}
