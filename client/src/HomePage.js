import React, { useState, useEffect, useCallback } from 'react';
import api from './api';
import BookCard from './BookCard';
import SearchBox from './SearchBox';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('All');

  const fetchBooks = useCallback(async (searchQuery = '') => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      const res = await api.get('/books', { params });
      setBooks(res.data);
      setFilteredBooks(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedGenre]);

  useEffect(() => {
    fetchBooks();
  }, [selectedGenre, fetchBooks]);

  const filterBooksByGenre = useCallback(() => {
    if (selectedGenre === 'All') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter(book => book.genre === selectedGenre));
    }
  }, [books, selectedGenre]);

  useEffect(() => {
    filterBooksByGenre();
  }, [filterBooksByGenre]);

  const handleSearch = (query) => {
    fetchBooks(query);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  const genres = ['All', 'Romance', 'Fiction', 'Fantasy', 'Mystery', 'Biography', 'History', 'Science Fiction', 'Self-Help', 'Business', 'Technology', 'Psychology', 'Philosophy', 'Non-Fiction'];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>EBOOKSTORE</h1>
      <SearchBox onSearch={handleSearch} />
      <div className="genre-filter">
        <label>Filter by Genre: </label>
        <select value={selectedGenre} onChange={(e) => handleGenreChange(e.target.value)}>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      <div className="book-grid">
        {filteredBooks.length === 0 ? (
          <div>No books available. Please check back later.</div>
        ) : (
          filteredBooks.map(book => (
            <BookCard key={book._id} book={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
