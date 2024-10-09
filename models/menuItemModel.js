const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, enum:['starters', 'main course', 'desserts', 'beverages'] }, // e.g., starters, main course, beverages
    availability: { type: Boolean, default: true },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
