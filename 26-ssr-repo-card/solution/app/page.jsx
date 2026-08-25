import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchRepoData } from "./api";
import Repo from "./Repo";

export const dynamic = "force-dynamic";

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["repoData"],
    queryFn: fetchRepoData,
    staleTime: 10_000,
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Repo />
      </HydrationBoundary>
    </main>
  );
}
