const express = require('express');
const {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  approveOrder,
  cancelOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/buyer', protect, getBuyerOrders);
router.get('/seller', protect, getSellerOrders);
router.patch('/:id/approve', protect, approveOrder);
router.patch('/:id/cancel', protect, cancelOrder);

module.exports = router;

