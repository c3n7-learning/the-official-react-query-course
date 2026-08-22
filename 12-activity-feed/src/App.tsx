import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const queryClient = new QueryClient();

interface ActivityT {
  title: string;
  done_at: string;
}

const PER_PAGE = 10;
const MAX_PAGE = 5;

async function getActivities(page: number): Promise<ActivityT[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activities = Array(PER_PAGE)
        .fill("-")
        .map((_, id) => {
          const ago = id + page;
          return {
            title: "Someone just joined Query Library",
            done_at: `${ago} hours ago`,
          };
        });
      resolve(page < MAX_PAGE ? activities : []);
    }, 1_000);
  });
}

function useActivities() {
  return useInfiniteQuery({
    queryKey: ["activities"],
    queryFn: ({ pageParam }) => getActivities(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage.length) {
        return undefined;
      }

      return lastPageParam + 1;
    },
  });
}

function Activities() {
  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useActivities();
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (!inView || !hasNextPage || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending || isError) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorCmp />;
  }

  return (
    <div className="max-w-xl w-full">
      <header className="border-b-4 border-foreground/50 pb-4 mb-4">
        <h1 className="text-2xl">
          <span>Query Library</span>
        </h1>
      </header>
      <main className="flex flex-col gap-2">
        {data.pages.flat().map((activity, id) => (
          <div
            key={id}
            className="flex flex-col gap-1 border border-foreground/25 rounded p-4"
          >
            <span>{activity.title}</span>
            <span className="text-xs">{activity.done_at}</span>
          </div>
        ))}

        <div ref={ref}>
          {hasNextPage ? "Loading..." : "No more items left."}
        </div>
      </main>
    </div>
  );
}

function Loading() {
  return <main>Loading...</main>;
}

function ErrorCmp() {
  return <main>Woops there was an error...</main>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="py-4 flex flex-col items-center bg-background text-foreground min-h-screen ">
        <Activities />
      </div>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
