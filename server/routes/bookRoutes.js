const express = require('express');
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(getBooks)      // Public access
    .post(protect, admin, createBook); // Admin only

router.route('/:id')
    .get(getBookById)   // Public access
    .put(protect, admin, updateBook)   // Admin only
    .delete(protect, admin, deleteBook); // Admin only

module.exports = router;