import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import api from './api';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if book is in user's favorites
    const checkFavoriteStatus = async () => {
      if (user) {
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
  }, [user, book._id]);

  const handleAddToCart = () => {
    addToCart(book);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Please login to add to wishlist');
      return;
    }

    try {
      console.log('Toggling favorite for book:', book._id, 'current state:', isFavorite);
      if (isFavorite) {
        console.log('Removing from favorites');
        const response = await api.delete(`/users/favorites/${book._id}`);
        console.log('Remove response:', response);
        setIsFavorite(false);
        alert('Removed from wishlist');
      } else {
        console.log('Adding to favorites');
        const response = await api.post(`/users/favorites/${book._id}`);
        console.log('Add response:', response);
        setIsFavorite(true);
        alert('Added to wishlist');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      console.error('Error details:', err.response?.data || err.message);
      alert('Failed to update wishlist');
    }
  };

  return (
    <div className="book-card" style={{ position: 'relative' }}>
      <button
        onClick={handleToggleFavorite}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: isFavorite ? '#dc3545' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          zIndex: 1
        }}
        title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
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
