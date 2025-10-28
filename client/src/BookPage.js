import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import api from './api';

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/books/${id}`);
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

  useEffect(() => {
    // Check if book is in user's favorites
    const checkFavoriteStatus = async () => {
      if (user && book) {
        try {
          const response = await api.get('/users/favorites');
          const favorites = response.data;
          setIsFavorite(favorites.some(fav => fav._id === book._id));
        } catch (err) {
          console.error('Error checking favorite status:', err);
        }
      }
    };

    checkFavoriteStatus();
  }, [user, book]);

  const handleAddToCart = () => {
    addToCart(book);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Please login to add to wishlist');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/users/favorites/${book._id}`);
        setIsFavorite(false);
        alert('Removed from wishlist');
      } else {
        await api.post(`/users/favorites/${book._id}`);
        setIsFavorite(true);
        alert('Added to wishlist');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Failed to update wishlist');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <img
            src={book.imageUrl || '/placeholder-book.jpg'}
            alt={book.title}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </div>
        <div style={{ flex: 2 }}>
          <h1 style={{ marginBottom: '10px', color: '#333' }}>{book.title}</h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '15px' }}>by {book.author}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Price:</strong> ${book.price}</p>
          <p><strong>Stock:</strong> {book.stock}</p>
          <p><strong>Description:</strong> {book.description}</p>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAddToCart}
              className="btn"
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add to Cart
            </button>

            <button
              onClick={handleToggleFavorite}
              style={{
                padding: '10px 20px',
                backgroundColor: isFavorite ? '#dc3545' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {isFavorite ? '❤️' : '🤍'} {isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage;
