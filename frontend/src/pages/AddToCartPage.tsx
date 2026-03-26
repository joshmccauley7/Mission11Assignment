import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Book } from "../types/Book";

function AddToCartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookTitle } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  const book = location.state as Book | undefined;

  const handleAddToCart = () => {
    if (!book || quantity < 1) return;
    addToCart(book, quantity);
    navigate("/cart");
  };

  return (
    <div className="container mt-4">
      <h2>Add to Cart: {decodeURIComponent(bookTitle || "Book")}</h2>
      <div className="d-flex gap-2 my-3">
        <input
          type="number"
          min={1}
          className="form-control"
          style={{ maxWidth: "250px" }}
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button className="btn btn-primary" onClick={handleAddToCart} disabled={!book}>
          Add to Cart
        </button>
      </div>
      {!book && (
        <p className="text-danger">
          Book details were not found. Go back and select a book again.
        </p>
      )}
      <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
}

export default AddToCartPage;
