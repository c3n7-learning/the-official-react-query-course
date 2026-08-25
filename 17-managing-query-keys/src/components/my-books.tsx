import { useMyBooks } from "../services/queries";

export default function MyBooks() {
  const { data, isPending, isError } = useMyBooks();

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorCmp />;
  }

  return (
    <div className="d-flex gap-2">
      {data.map((book) => (
        <div className="card" style={{ width: "9rem" }} key={book.title}>
          <img
            src={book.thumbnail}
            className="card-img-top object-fit-cover"
            style={{ width: "9rem", height: "12rem" }}
            alt={book.title}
          />
          <div className="card-body">
            <h5 className="card-title fs-6">{book.title}</h5>
          </div>
        </div>
      ))}
    </div>
  );
}

function Loading() {
  return <main>Loading...</main>;
}

function ErrorCmp() {
  return <main>Woops there was an error...</main>;
}
