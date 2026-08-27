import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Repo from "./Repo";
import { fetchRepoData } from "./api";

export const dynamic = "force-dynamic";

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.query({
    queryKey: ["repoData"],
    queryFn: fetchRepoData,
    staleTime: 10_000,
  })


  // TODO: prefetch in QueryClient and hydrate with HydrationBoundary
  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Repo />
      </HydrationBoundary>
    </main>
  );
}
