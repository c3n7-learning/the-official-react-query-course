import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchRepoData } from "./api";
import Repo from "./Repo";

export const dynamic = "force-dynamic";

function Navbar() {
  return <p>Navbar: always visible</p>;
}

function Footer() {
  return <p>Footer: always visible</p>;
}

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["repoData"],
    queryFn: fetchRepoData,
    staleTime: 10_000,
  });

  return (
    <main className="shell">
      <Navbar />
      {/* TODO: stream this section with Suspense */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Repo />
      </HydrationBoundary>
      <Footer />
    </main>
  );
}
