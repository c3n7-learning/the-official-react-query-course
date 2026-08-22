import type { BookT } from "./book-detail";

function Book({
  thumbnail,
  title,
  authors,
  onClick,
}: {
  thumbnail: string;
  title: string;
  authors: string[];
  onClick: () => void;
}) {
  return (
    <div className="mb-2 p-2" style={{ width: "16rem" }} onClick={onClick}>
      <div className="card h-100">
        <img
          src={thumbnail}
          alt={title}
          className="card-img-top object-fit-cover"
          style={{ height: "13rem" }}
        />
        <div className="card-body">
          <h5 className="card-title fs-6">{title}</h5>
          <p className="card-text text-body-secondary">
            <small>{authors.join(", ")}</small>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResultList({
  searchTerm,
  data,
  onClickBook,
}: {
  searchTerm: string;
  data: BookT[];
  onClickBook: (id: string) => void;
}) {
  return (
    <section>
      <div>
        <h2>
          Search results for <strong>{searchTerm}</strong>
        </h2>
        <div className="d-flex flex-wrap align-items-stretch">
          {data.map((book) => {
            return (
              <Book
                key={book.id}
                thumbnail={book.thumbnail}
                title={book.title}
                authors={book.authors}
                onClick={() => onClickBook(book.id)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
