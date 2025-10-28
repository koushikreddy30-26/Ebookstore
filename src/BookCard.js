import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(book);
  };

  return (
    <div className="book-card">
      <img src={book.imageUrl || '/placeholder-book.jpg'} alt={book.title} />
      <h3>{book.title}</h3>
      <p>by {book.author}</p>
      <p>${book.price}</p>
      <p>Stock: {book.stock}</p>
      <Link to={`/book/${book._id}`} className="btn">View Details</Link>
      <button onClick={handleAddToCart} className="btn" style={{ marginLeft: '10px' }}>
        Add to Cart
      </button>
    </div>
  );
};

export default BookCard;
