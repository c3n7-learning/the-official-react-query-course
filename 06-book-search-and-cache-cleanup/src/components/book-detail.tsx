import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";

export interface BookT {
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

async function getData(bookId: string): Promise<BookT> {
  const url = `${BASE_URL}/books/${bookId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}

function useBook(bookId: string) {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getData(bookId),
    staleTime: 5_000,
    gcTime: 5_000,
  });
}

function Book({ bookId }: { bookId: string }) {
  const { data, isPending, isError } = useBook(bookId);

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorCmp />;
  }

  return (
    <>
      <div className="d-flex gap-2 align-items-start">
        <img
          src={data.thumbnail}
          style={{ width: "18rem" }}
          className="card-img-top rounded"
          alt="..."
        />

        <div className="card" style={{ maxWidth: "640px" }}>
          <div className="card-body">
            <h5 className="card-title">{data.title} </h5>
            <p className="card-text">
              <small className="text-body-secondary">
                {data.authors.join(", ")} {"  "}({data.averageRating})
              </small>
            </p>
            <div className="card-text">
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Loading() {
  return <main>Loading...</main>;
}

function ErrorCmp() {
  return <main>Woops there was an error...</main>;
}

export default function BookDetail({
  bookId,
  onClickBack,
}: {
  bookId: string;
  onClickBack: () => void;
}) {
  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <button
            onClick={onClickBack}
            className="btn btn-link d-flex align-items-center mb-0 h1"
          >
            <ChevronLeft /> <span>back</span>
          </button>
        </div>
      </nav>

      <div className="container pt-4 d-flex flex-column gap-2">
        <Book bookId={bookId} />
      </div>
    </>
  );
}
