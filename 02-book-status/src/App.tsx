import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

interface BookData {
  title: string;
  authors: string[];
  thumbnail: string;
}

async function getData(): Promise<BookData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: "The Hobbit",
        authors: ["J.R.R. Tolkien"],
        thumbnail: "https://ui.dev/images/courses/query/hobbit.jpg",
      });
    }, 1000);
  });
}

function useBook() {
  return useQuery({
    queryKey: ["book"],
    queryFn: getData,
  });
}

function Book() {
  const { data, isPending, isError } = useBook();

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <div className="max-w-xl w-full">
      <header className="border-b-4 border-foreground/50 pb-4 mb-4">
        <h1 className="text-2xl">
          <span>Query Library</span>
        </h1>
      </header>
      <main>
        <div>
          <span className="book-cover">
            <img src={data.thumbnail} alt={data.title} />
          </span>
        </div>
        <div>
          <h2 className="book-title">{data.title}</h2>
          <small className="book-author">{data.authors.join(", ")}</small>
        </div>
      </main>
    </div>
  );
}

function Loading() {
  return <main>Loading...</main>;
}

function Error() {
  return <main>Woops there was an error...</main>;
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
