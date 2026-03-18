import { useEffect, useState } from "react";
import type { Book } from "./types/Book";

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortByTitle, setSortByTitle] = useState<boolean>(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchBooks = async () => {
      const sortByParam = sortByTitle ? "title" : "";
      const sortDirParam = sortDirection;

      const response = await fetch(
        `https://localhost:5000/book/allbooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortByParam}&sortDir=${sortDirParam}`
      );
      const data = await response.json();

      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, sortByTitle, sortDirection]);

  return (
    <>
      <h1>Book List</h1>
      <br />

      <div className="controls-row">
        <label className="control-group">
          <span>Results per page:</span>
          <select
            value={pageSize}
            onChange={(p) => {
              setPageSize(Number(p.target.value));
              setPageNum(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </label>

        <label className="control-group">
          <span>Sort by title:</span>
          <select
            value={
              sortByTitle ? (sortDirection === "asc" ? "title-asc" : "title-desc") : "none"
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value === "none") {
                setSortByTitle(false);
              } else {
                setSortByTitle(true);
                setSortDirection(value === "title-asc" ? "asc" : "desc");
              }
              setPageNum(1);
            }}
          >
            <option value="none">None</option>
            <option value="title-asc">A → Z</option>
            <option value="title-desc">Z → A</option>
          </select>
        </label>
      </div>

      {books.map((b) => (
        <div id="bookCard" className="card" key={b.bookId}>
          <h3 className="card-title">{b.title}</h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>
                <strong>Author:</strong> {b.author}
              </li>
              <li>
                <strong>Publisher:</strong> {b.publisher}
              </li>
              <li>
                <strong>ISBN:</strong> {b.isbn} Individuals Served
              </li>
              <li>
                <strong>Classification:</strong> {b.classification}
              </li>
              <li>
                <strong>Category:</strong> {b.category}
              </li>
              <li>
                <strong>Page Count:</strong> {b.pageCount}
              </li>
              <li>
                <strong>Price:</strong> ${b.price}
              </li>
            </ul>
          </div>
        </div>
      ))}

      <div className="pagination">
        <button
          className="page-button nav"
          disabled={pageNum === 1}
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isActive = pageNum === page;
          return (
            <button
              key={page}
              className={`page-button number${isActive ? " active" : ""}`}
              onClick={() => setPageNum(page)}
              disabled={isActive}
            >
              {page}
            </button>
          );
        })}

        <button
          className="page-button nav"
          disabled={pageNum === totalPages || totalPages === 0}
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>
      </div>

      <p className="pagination-summary">
        Showing page {totalPages === 0 ? 0 : pageNum} of {totalPages} ({totalItems}{" "}
        books)
      </p>
    </>
  );
}

export default BookList;