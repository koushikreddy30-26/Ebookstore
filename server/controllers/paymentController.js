const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
const createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', items } = req.body;

        const options = {
            amount: amount * 100, // Razorpay expects amount in paisa
            currency,
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        // Create order in database
        const dbOrder = new Order({
            user: req.user._id,
            items,
            totalAmount: amount,
            paymentId: order.id,
            paymentStatus: 'pending',
            orderStatus: 'confirmed'
        });

        await dbOrder.save();

        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            orderId: dbOrder._id
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', razorpay.key_secret)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            // Update order status
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'completed',
                orderStatus: 'confirmed'
            });

            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'failed'
            });
            res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Payment verification error' });
    }
};

module.exports = { createOrder, verifyPayment };
