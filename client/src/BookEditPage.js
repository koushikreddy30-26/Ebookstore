import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BookEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    price: '',
    imageUrl: '',
    stock: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!id;

  const fetchBook = useCallback(async () => {
    try {
      const res = await axios.get(`/api/books/${id}`);
      setFormData(res.data);
    } catch (err) {
      setError('Failed to fetch book');
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    if (user && user.isAdmin) {
      if (isEdit) {
        fetchBook();
      }
    }
  }, [user, isEdit, fetchBook]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await axios.put(`/api/books/${id}`, formData);
      } else {
        await axios.post('/api/books', formData);
      }
      navigate('/admin/books');
    } catch (err) {
      setError('Failed to save book');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.isAdmin) {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div className="form">
      <h1>{isEdit ? 'Edit Book' : 'Add New Book'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Author:</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Genre:</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Book'}
        </button>
      </form>
    </div>
  );
};

export default BookEditPage;
