import React from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import { fetchRepoData } from "./api";
import Repo from "./Repo";

export const dynamic = "force-dynamic";

function Navbar() {
  return <p>Navbar: always visible</p>;
}

function Footer() {
  return <p>Footer: always visible</p>;
}

function RepoSkeleton() {
  return <div className="skeleton" aria-label="repo-skeleton" />;
}

export default async function Page() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });

  queryClient.prefetchQuery({
    queryKey: ["repoData"],
    queryFn: fetchRepoData,
    staleTime: 10_000,
  });

  return (
    <main className="shell">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <React.Suspense fallback={<RepoSkeleton />}>
          <Repo />
        </React.Suspense>
      </HydrationBoundary>
      <Footer />
    </main>
  );
}
