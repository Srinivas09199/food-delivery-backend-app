const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createOrder, getOrder, updateOrderStatus, getAllOrders, trackOrder } = require('../controllers/orderController');
const router = express.Router();

router.post('/orders', authMiddleware, createOrder);
router.get('/:orderId', authMiddleware, getOrder);
router.put('/:orderId/status', authMiddleware, updateOrderStatus);
router.get('/orders', authMiddleware, getAllOrders);
router.get('/orders/:orderId/track', authMiddleware, trackOrder)

module.exports = router;
