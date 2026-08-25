import Repo from "./Repo";

export const dynamic = "force-dynamic";

export default async function Page() {
  // TODO: prefetch in QueryClient and hydrate with HydrationBoundary
  return (
    <main>
      <Repo />
    </main>
  );
}
