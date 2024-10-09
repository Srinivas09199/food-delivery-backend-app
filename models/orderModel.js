const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
    deliveryAddress: { type: String, required: true },
    totalCost: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'In Progress', 'Out for Delivery', 'Delivered'],
        default: 'Pending'
    },
    estimatedDeliveryTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
