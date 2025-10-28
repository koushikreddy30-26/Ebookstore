import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/books/${id}`);
      setBook(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch book');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const handleAddToCart = () => {
    addToCart(book);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div>
      <h1>{book.title}</h1>
      <img src={book.imageUrl || '/placeholder-book.jpg'} alt={book.title} style={{ maxWidth: '300px' }} />
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Price:</strong> ${book.price}</p>
      <p><strong>Stock:</strong> {book.stock}</p>
      <p><strong>Description:</strong> {book.description}</p>
      <button onClick={handleAddToCart} className="btn">Add to Cart</button>
    </div>
  );
};

export default BookPage;
