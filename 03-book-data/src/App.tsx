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

export interface Book {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string; // ISO date string (YYYY-MM-DD)
  description: string; // HTML formatted string
  thumbnail: string; // URL string
  previewLink: string; // URL string
  averageRating: number;
  availableCopies: number;
  isCheckedOutByUser: boolean;
}

const BASE_URL = "https://library-api.uidotdev.workers.dev";

async function getData(): Promise<Book> {
  const url = `${BASE_URL}/books/pD6arNyKyi8C`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
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
    return <ErrorCmp />;
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

function ErrorCmp() {
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
