const Book = require('../models/Book');

// @desc    Fetch all books
// @route   GET /api/books
const getBooks = async (req, res) => {
    try {
        const { search, genre } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (genre && genre !== 'All') {
            query.genre = genre;
        }

        const books = await Book.find(query);
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Failed to fetch books' });
    }
};

// @desc    Fetch single book
// @route   GET /api/books/:id
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ message: 'Failed to fetch book' });
    }
};

// @desc    Create a book (Admin only)
// @route   POST /api/books
const createBook = async (req, res) => {
    try {
        const book = new Book(req.body);

        const createdBook = await book.save();
        res.status(201).json(createdBook);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: 'Failed to create book' });
    }
};

// @desc    Update a book (Admin only)
// @route   PUT /api/books/:id
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            // Update fields based on req.body
            book.title = req.body.title || book.title;
            book.author = req.body.author || book.author;
            book.genre = req.body.genre || book.genre;
            book.description = req.body.description || book.description;
            book.price = req.body.price || book.price;
            book.imageUrl = req.body.imageUrl || book.imageUrl;
            book.stock = req.body.stock || book.stock;

            const updatedBook = await book.save();
            res.json(updatedBook);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Failed to update book' });
    }
};

// @desc    Delete a book (Admin only)
// @route   DELETE /api/books/:id
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (book) {
            res.json({ message: 'Book removed' });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Failed to delete book' });
    }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };