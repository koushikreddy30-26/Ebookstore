const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    stock: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Book', bookSchema);