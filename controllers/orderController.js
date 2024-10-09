const Order = require('../models/orderModel');
const MenuItem = require('../models/menuItemModel');
const mongoose = require('mongoose');

// Helper function to calculate the total cost of an order
async function calculateTotalCost(items) {
    const itemIds = items.map(item => item.itemId);

    // Fetch the menu items prices
    const menuItems = await MenuItem.find({ _id: { $in: itemIds } });

    // Calculate the total cost
    return items.reduce((total, item) => {
        const menuItem = menuItems.find(menu => menu._id.equals(item.itemId));
        return total + (menuItem.price * item.quantity);
    }, 0);
}

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { restaurantId, items, deliveryAddress, userId } = req.body;

        // Validate request body
        if (!restaurantId || !items || items.length === 0 || !deliveryAddress || !userId) {
            return res.status(400).send({
                success: false,
                message: 'All fields are required'
            });
        }

        // Calculate the total cost of the order
        const totalCost = await calculateTotalCost(items);

        const order = new Order({
            userId,
            restaurantId,
            items: items.map(item => item.itemId),
            deliveryAddress,
            totalCost,
        });

        await order.save();
        res.status(201).send({ success: true, data: order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send({ success: false, message: 'Error creating order', error: error.message });
    }
};

// Get order details
exports.getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).send({ success: false, message: 'Invalid order ID format' });
        }

        const order = await Order.findById(orderId).populate('items');
        if (!order) {
            return res.status(404).send({ success: false, message: 'Order not found' });
        }

        res.status(200).send({ success: true, data: order });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).send({ success: false, message: 'Error fetching order', error: error.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).send({ success: false, message: 'Invalid order ID format' });
        }

        // Validate status
        if (!status) {
            return res.status(400).send({ success: false, message: 'Status is required' });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).send({ success: false, message: 'Order not found' });
        }

        res.status(200).send({ success: true, data: order });

        // Notify clients about status change
        if (typeof io !== 'undefined') {
            io.emit(`order_${orderId}_status`, status);
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send({ success: false, message: 'Error updating order status', error: error.message });
    }
};

// List all orders for the logged-in user
exports.getAllOrders = async (req, res) => {
    try {
        const { userId } = req.query; // Changed to req.query for GET request

        if (!userId) {
            return res.status(400).send({ success: false, message: 'User ID is required' });
        }

        const orders = await Order.find({ userId }).populate('items');
        res.status(200).send({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send({ success: false, message: 'Error fetching orders', error: error.message });
    }
};

// Track order status
exports.trackOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).send({ success: false, message: 'Invalid order ID format' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send({ success: false, message: 'Order not found' });
        }

        res.status(200).send({ success: true, status: order.status });
    } catch (error) {
        console.error('Error tracking order:', error);
        res.status(500).send({ success: false, message: 'Error tracking order', error: error.message });
    }
};
