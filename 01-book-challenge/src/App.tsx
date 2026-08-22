import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function Book() {
  const { data } = useQuery({
    queryKey: ["book"],
    queryFn: () => Promise.resolve("The hobbit"),
  });

  return (
    <div className="max-w-xl w-full">
      <header className="border-b-4 border-foreground/50 pb-4 mb-4">
        <h1 className="text-2xl">
          <span>Query Library</span>
        </h1>
      </header>
      <main>
        <h2 className="text-lg">{data}</h2>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="py-4 flex flex-col items-center bg-background text-foreground min-h-screen ">
        <Book />
      </div>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
