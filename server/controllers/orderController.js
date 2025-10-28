const Order = require('../models/Order');

// @desc    Get user orders
// @route   GET /api/orders
const getUserOrders = async (req, res) => {
    try {
        console.log('Getting orders for user:', req.user._id);
        const orders = await Order.find({ user: req.user._id }).populate('user', 'username email').sort({ createdAt: -1 });
        console.log('Found orders:', orders.length);
        res.json(orders);
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create COD order
// @route   POST /api/orders/create-cod
const createCODOrder = async (req, res) => {
    try {
        const { amount, items } = req.body;

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount: amount,
            paymentMethod: 'cod',
            paymentStatus: 'pending',
            orderStatus: 'confirmed'
        });

        const savedOrder = await order.save();
        await savedOrder.populate('user', 'username email');

        res.status(201).json({
            message: 'Order placed successfully with Cash on Delivery',
            order: savedOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
            return res.status(400).json({ message: 'Cannot cancel this order' });
        }

        order.orderStatus = 'cancelled';
        if (req.body.reason) {
            order.cancelReason = req.body.reason;
        }
        await order.save();

        res.json({
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Return order
// @route   PUT /api/orders/:id/return
const returnOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to return this order' });
        }

        if (order.orderStatus !== 'delivered') {
            return res.status(400).json({ message: 'Can only return delivered orders' });
        }

        order.orderStatus = 'returned';
        if (req.body.reason) {
            order.returnReason = req.body.reason;
        }
        await order.save();

        res.json({
            message: 'Return request submitted successfully',
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserOrders, createCODOrder, cancelOrder, returnOrder };
