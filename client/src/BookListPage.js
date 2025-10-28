import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/books');
      setBooks(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/books/${id}`);
        setBooks(books.filter(book => book._id !== id));
      } catch (err) {
        setError('Failed to delete book');
        console.error(err);
      }
    }
  };

  if (!user || !user.isAdmin) {
    return <div>Access denied. Admin only.</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Book Management</h1>
      <Link to="/admin/book/new" className="btn">Add New Book</Link>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Image</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Title</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Author</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Stock</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <img src={book.imageUrl || '/placeholder-book.jpg'} alt={book.title} style={{ width: '50px', height: '70px', objectFit: 'cover' }} />
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{book.title}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{book.author}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹{(book.price * 83).toFixed(2)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{book.stock}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <Link to={`/admin/book/${book._id}/edit`} className="btn" style={{ marginRight: '10px' }}>Edit</Link>
                <button onClick={() => handleDelete(book._id)} className="btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookListPage;
