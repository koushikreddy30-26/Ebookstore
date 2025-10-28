const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        title: String,
        author: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['razorpay', 'cod'],
        default: 'razorpay'
    },
    paymentId: {
        type: String,
        required: false
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'placed'
    },
    cancelReason: {
        type: String,
        required: false
    },
    returnReason: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
