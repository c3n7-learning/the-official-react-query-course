import { useSearch } from "../services/queries";
import type { BookT } from "../types/book";

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

function Paginator({
  searchTerm,
  page,
  setPage,
}: {
  searchTerm: string;
  page: number;
  setPage: (page: number) => void;
}) {
  const { data, isSuccess } = useSearch(searchTerm, page);

  if (!isSuccess) {
    return;
  }

  const { currentPage, totalPages } = data;

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Previous
          </button>
        </li>
        {Array(totalPages)
          .fill("-")
          .map((_, id) => (
            <li
              className={`page-item ${currentPage === id + 1 ? "active" : ""}`}
              key={id}
            >
              <span className="page-link" onClick={() => setPage(id + 1)}>
                {id + 1}
              </span>
            </li>
          ))}
        <li
          className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}
        >
          <button
            className="page-link"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
export default function ResultList({
  searchTerm,
  data,
  onClickBook,
  page,
  setPage,
}: {
  searchTerm: string;
  data: BookT[];
  onClickBook: (id: string) => void;
  page: number;
  setPage: (page: number) => void;
}) {
  return (
    <section>
      <div>
        <div className="d-flex gap-2 align-items-center">
          <h6 className="flex-grow-1">
            Search results for <strong>{searchTerm}</strong>
          </h6>
          <Paginator searchTerm={searchTerm} page={page} setPage={setPage} />
        </div>
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
