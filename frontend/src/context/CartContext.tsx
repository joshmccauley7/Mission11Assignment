import { createContext, useContext, useState, type ReactNode } from "react";
import type { CartItem } from "../types/CartItem";
import type { Book } from "../types/Book";

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book, quantity: number) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (book: Book, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.book.bookId === book.bookId);
      if (existing) {
        return prev.map((x) =>
          x.book.bookId === book.bookId
            ? { ...x, quantity: x.quantity + quantity }
            : x
        );
      }
      return [...prev, { book, quantity }];
    });
  };

  const removeFromCart = (bookId: number) => {
    setCart((prev) => prev.filter((x) => x.book.bookId !== bookId));
  };

  const updateQuantity = (bookId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(bookId);
      return;
    }
    setCart((prev) =>
      prev.map((x) => (x.book.bookId === bookId ? { ...x, quantity } : x))
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
