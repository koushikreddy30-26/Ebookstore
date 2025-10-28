const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
const getUserFavorites = async (req, res) => {
    try {
        console.log('Getting favorites for user:', req.user._id);
        const user = await User.findById(req.user._id).populate('favorites');
        console.log('Found favorites:', user.favorites.length);
        res.json(user.favorites);
    } catch (error) {
        console.error('Error getting favorites:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add book to favorites
// @route   POST /api/users/favorites/:bookId
const addToFavorites = async (req, res) => {
    try {
        console.log('Adding to favorites for user:', req.user._id, 'book:', req.params.bookId);
        const user = await User.findById(req.user._id);
        const bookId = req.params.bookId;

        if (!user.favorites.includes(bookId)) {
            user.favorites.push(bookId);
            await user.save();
            console.log('Book added to favorites');
        } else {
            console.log('Book already in favorites');
        }

        res.json({ message: 'Book added to favorites' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Remove book from favorites
// @route   DELETE /api/users/favorites/:bookId
const removeFromFavorites = async (req, res) => {
    try {
        console.log('Removing from favorites for user:', req.user._id, 'book:', req.params.bookId);
        const user = await User.findById(req.user._id);
        const bookId = req.params.bookId;

        user.favorites = user.favorites.filter(id => id.toString() !== bookId);
        await user.save();
        console.log('Book removed from favorites');

        res.json({ message: 'Book removed from favorites' });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        const orderCount = await require('../models/Order').countDocuments({ user: req.user._id });
        const favoriteCount = user.favorites.length;

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            orderCount,
            favoriteCount
        });
    } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, getUserFavorites, addToFavorites, removeFromFavorites, getUserProfile };
