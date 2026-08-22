import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import BookDetail from "./components/book-detail";
import BookList from "./components/book-list";

const queryClient = new QueryClient();

function App() {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [term, setTerm] = useState("Westeros");

  return (
    <QueryClientProvider client={queryClient}>
      {selectedBookId !== null ? (
        <BookDetail
          bookId={selectedBookId}
          onClickBack={() => setSelectedBookId(null)}
          searchTerm={term}
        />
      ) : (
        <BookList
          setBookId={(id) => setSelectedBookId(id)}
          term={term}
          setTerm={(v) => setTerm(v)}
        />
      )}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
