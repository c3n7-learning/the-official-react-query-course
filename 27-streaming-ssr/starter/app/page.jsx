import { HydrationBoundary, QueryClient, defaultShouldDehydrateQuery, dehydrate } from "@tanstack/react-query";
import { fetchRepoData } from "./api";
import Repo from "./Repo";
import React from "react";

export const dynamic = "force-dynamic";

function Navbar() {
  return <p>Navbar: always visible</p>;
}

function Footer() {
  return <p>Footer: always visible</p>;
}

export default async function Page() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: {
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending"
      }
    }
  });

  queryClient.query({
    queryKey: ["repoData"],
    queryFn: fetchRepoData,
    staleTime: 10_000,
  });

  return (
    <main className="shell">
      <Navbar />
      {/* TODO: stream this section with Suspense */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <React.Suspense fallback={<p>Loading repo...</p>}>
          <Repo />
        </React.Suspense>
      </HydrationBoundary>
      <Footer />
    </main>
  );
}
