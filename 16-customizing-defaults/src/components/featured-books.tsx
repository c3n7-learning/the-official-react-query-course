import { useFeaturedBooks } from "../services/queries";
import { Book } from "./result-list";

export default function FeaturedBooks({
  setBookId,
}: {
  setBookId: (id: string) => void;
}) {
  const { data, isPending, isError } = useFeaturedBooks();

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorCmp />;
  }

  return (
    <div className="container py-4">
      <div>Featured Books</div>
      <div className="d-flex flex-wrap">
        {data.map((book) => (
          <Book
            key={book.id}
            thumbnail={book.thumbnail}
            title={book.title}
            authors={book.authors}
            onClick={() => setBookId(book.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Loading() {
  return <main>Loading...</main>;
}

function ErrorCmp() {
  return <main>Woops there was an error...</main>;
}
