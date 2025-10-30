import React, { useState, useEffect } from 'react';
import api from './api';
import BookCard from './BookCard';
import SearchBox from './SearchBox';

const genres = ['All', 'Romance', 'Fiction', 'Fantasy', 'Mystery', 'Biography', 'History', 'Science Fiction', 'Self-Help', 'Business', 'Technology', 'Psychology', 'Philosophy', 'Non-Fiction'];

const HomePage = () => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
        try {
            setLoading(true);
            const params = {
                search: searchQuery,
                genre: selectedGenre === 'All' ? '' : selectedGenre,
            };
            const res = await api.get('/books', { params });
            setFilteredBooks(res.data || []); // Ensure it's an array
            setError(null);
        } catch (err) {
            setError('Failed to fetch books');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchBooks();
  }, [searchQuery, selectedGenre]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

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
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => <BookCard key={book._id} book={book} />)
        ) : (
          !loading && <div>No books found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
