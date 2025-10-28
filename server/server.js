const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import Models
require('./models/User');
require('./models/Book');
require('./models/Order');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Database Connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));
} else {
  console.log('MONGO_URI not set, skipping MongoDB connection');
}

// Route Setup
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);

// Error Handling (Simple)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});