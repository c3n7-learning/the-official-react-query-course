import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

interface ActivityT {
  title: string;
  done_at: string;
}

const activities: ActivityT[] = [
  {
    title: "Someone just joined Query Library.",
    done_at: "5 hours ago",
  },

  {
    title: "Someone just joined Query Library.",
    done_at: "7 hours ago",
  },
  {
    title: "Someone just joined Query Library.",
    done_at: "8 hours ago",
  },
  {
    title: "Someone just joined Query Library.",
    done_at: "1 day ago",
  },
  {
    title: "Someone just joined Query Library.",
    done_at: "2 days ago",
  },
  {
    title: "Someone just joined Query Library.",
    done_at: "5 days ago",
  },
];

async function getActivities(): Promise<ActivityT[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(activities);
    }, 1_000);
  });
}

function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
    refetchInterval: 5_000,
  });
}

function Activities() {
  const { data, dataUpdatedAt, isPending, isFetching, isError } =
    useActivities();

  if (isPending || isFetching) {
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
        <div>{new Date(dataUpdatedAt).toLocaleTimeString()}</div>

        {data.map((activity, id) => (
          <div
            key={id}
            className="flex flex-col gap-1 border border-foreground/25 rounded p-4"
          >
            <span>{activity.title}</span>
            <span className="text-xs">{activity.done_at}</span>
          </div>
        ))}
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
