import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Book } from "./types/Book";

type SortValue = "none" | "title-asc" | "title-desc";

function BookList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortValue, setSortValue] = useState<SortValue>("none");

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("https://localhost:5000/book/categories");
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      const sortBy = sortValue === "none" ? "" : "title";
      const sortDir = sortValue === "title-desc" ? "desc" : "asc";
      const category = selectedCategory === "All" ? "" : selectedCategory;

      const response = await fetch(
        `https://localhost:5000/book/allbooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortBy}&sortDir=${sortDir}&category=${encodeURIComponent(category)}`
      );
      const data = await response.json();

      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, sortValue, selectedCategory]);

  useEffect(() => {
    const tooltipItems = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    const bs = (window as Window & { bootstrap?: any }).bootstrap;
    if (!bs?.Tooltip) return;

    tooltipItems.forEach((item) => bs.Tooltip.getOrCreateInstance(item));
  }, [books]);

  return (
    <div className="my-4">
      <div className="row align-items-center g-3 mb-3">
        <div className="col-md-12">
          <h1 className="mb-0">Book List</h1>
        </div>
      </div>

      <div className="row g-3">
        <aside className="col-lg-3">
          <div className="card p-3">
            <label className="form-label">Category</label>
            <select
              className="form-select mb-3"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPageNum(1);
              }}
            >
              <option value="All">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label className="form-label">Sort by title</label>
            <select
              className="form-select mb-3"
              value={sortValue}
              onChange={(e) => {
                setSortValue(e.target.value as SortValue);
                setPageNum(1);
              }}
            >
              <option value="none">None</option>
              <option value="title-asc">A to Z</option>
              <option value="title-desc">Z to A</option>
            </select>

            <label className="form-label">Results per page</label>
            <select
              className="form-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNum(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </aside>

        <main className="col-lg-9">
          {books.map((b) => (
            <div className="card mb-3 shadow-sm" key={b.bookId}>
              <div className="card-body">
                <h5 className="card-title">{b.title}</h5>
                <ul className="list-unstyled mb-2">
                  <li><strong>Author:</strong> {b.author}</li>
                  <li><strong>Publisher:</strong> {b.publisher}</li>
                  <li><strong>ISBN:</strong> {b.isbn}</li>
                  <li><strong>Classification:</strong> {b.classification}</li>
                  <li><strong>Category:</strong> {b.category}</li>
                  <li><strong>Page Count:</strong> {b.pageCount}</li>
                  <li><strong>Price:</strong> ${b.price.toFixed(2)}</li>
                </ul>
                <button
                  className="btn btn-success"
                  data-bs-toggle="tooltip"
                  data-bs-title="Open add-to-cart page"
                  onClick={() =>
                    navigate(
                      `/add-to-cart/${encodeURIComponent(b.title)}/${b.bookId}`,
                      { state: b }
                    )
                  }
                >
                  Add to Cart
                </button>
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
              const p = i + 1;
              return (
                <button
                  key={p}
                  className={`page-button number${pageNum === p ? " active" : ""}`}
                  disabled={pageNum === p}
                  onClick={() => setPageNum(p)}
                >
                  {p}
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
            Showing page {totalPages === 0 ? 0 : pageNum} of {totalPages} ({totalItems} books)
          </p>
        </main>
      </div>
    </div>
  );
}

export default BookList;