const express = require('express');
const { createOrder, confirmUPIPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/confirm-upi', protect, confirmUPIPayment);

module.exports = router;
