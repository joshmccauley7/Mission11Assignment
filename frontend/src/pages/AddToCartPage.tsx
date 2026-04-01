import { useLocation, useNavigate, useParams } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../types/CartItem';
import type { Book } from '../types/Book';
import { useState } from 'react';

function AddToCartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookTitle, bookId } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(0);
  const book = location.state as Book | undefined;

  const handleAddToCart = () => {
    if (!book || quantity < 1) return;

    const newItem: CartItem = {
      bookId: Number(bookId),
      bookTitle: bookTitle || 'No Book Found',
      bookPrice: book.price,
      quantity,
    };
    addToCart(newItem);
    navigate('/cart');
  };

  return (
    <>
      <WelcomeBand />
      <h2>Add to Cart: {bookTitle}</h2>

      <div>
        <input
          type="number"
          min={1}
          placeholder="Enter quantity"
          value={quantity}
          onChange={(x) => setQuantity(Number(x.target.value))}
        />
        <button onClick={handleAddToCart} disabled={!book}>
          Add to Cart
        </button>
      </div>

      {!book && (
        <p>Book details were not found. Please select the book again.</p>
      )}

      <button onClick={() => navigate(-1)}>Go Back</button>
    </>
  );
}

export default AddToCartPage;
