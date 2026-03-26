import "./App.css";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import CartSummary from "./components/CartSummary";
import { CartProvider } from "./context/CartContext";
import AddToCartPage from "./pages/AddToCartPage";
import BooksPage from "./pages/BooksPage";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <CartProvider>
      <Router>
        <CartSummary />
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/add-to-cart/:bookTitle/:bookId" element={<AddToCartPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
