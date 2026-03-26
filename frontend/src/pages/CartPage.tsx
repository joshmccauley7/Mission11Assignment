import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + item.quantity * item.book.price, 0);

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="list-group mb-3">
          {cart.map((item) => (
            <li
              key={item.book.bookId}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <div className="fw-semibold">{item.book.title}</div>
                <div>${item.book.price.toFixed(2)} each</div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => updateQuantity(item.book.bookId, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => updateQuantity(item.book.bookId, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeFromCart(item.book.bookId)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <h4>Total: ${total.toFixed(2)}</h4>
      <div className="d-flex gap-2 mt-2">
        <button className="btn btn-outline-primary" onClick={() => navigate("/books")}>
          Continue Browsing
        </button>
      </div>
    </div>
  );
}

export default CartPage;
