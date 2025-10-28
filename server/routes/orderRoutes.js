const express = require('express');
const { getUserOrders, createCODOrder, cancelOrder, returnOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getUserOrders);
router.post('/create-cod', protect, createCODOrder);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/return', protect, returnOrder);

module.exports = router;
