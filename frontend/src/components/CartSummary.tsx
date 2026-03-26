import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartSummary() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.quantity * item.book.price,
    0
  );

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "20px",
        background: "#f8f9fa",
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        fontSize: "16px",
        zIndex: 1050,
      }}
      onClick={() => navigate("/cart")}
      role="button"
      aria-label="Open cart"
    >
      <span>🛒</span>
      <strong>{totalAmount.toFixed(2)}</strong>
    </div>
  );
}

export default CartSummary;
