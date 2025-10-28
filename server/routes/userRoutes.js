const express = require('express');
const { registerUser, loginUser, getUserFavorites, addToFavorites, removeFromFavorites, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/favorites', protect, getUserFavorites);
router.post('/favorites/:bookId', protect, addToFavorites);
router.delete('/favorites/:bookId', protect, removeFromFavorites);

module.exports = router;
