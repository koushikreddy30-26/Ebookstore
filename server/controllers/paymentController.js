const Order = require('../models/Order');

// @desc    Create UPI order (no payment gateway, just order creation)
// @route   POST /api/payments/create-order
const createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', items, paymentMethod = 'upi' } = req.body;

        // Create order in database
        const dbOrder = new Order({
            user: req.user._id,
            items,
            totalAmount: amount,
            paymentMethod,
            paymentStatus: 'pending',
            orderStatus: 'confirmed'
        });

        await dbOrder.save();

        res.json({
            orderId: dbOrder._id,
            amount,
            currency,
            paymentMethod
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
};

// @desc    Confirm UPI payment (manual verification)
// @route   POST /api/payments/confirm-upi
const confirmUPIPayment = async (req, res) => {
    try {
        const { orderId, transactionId } = req.body;

        // Update order status to completed
        await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'completed',
            orderStatus: 'confirmed',
            transactionId
        });

        res.json({ success: true, message: 'Payment confirmed successfully' });
    } catch (error) {
        console.error('Error confirming UPI payment:', error);
        res.status(500).json({ message: 'Payment confirmation error' });
    }
};

module.exports = { createOrder, confirmUPIPayment };
