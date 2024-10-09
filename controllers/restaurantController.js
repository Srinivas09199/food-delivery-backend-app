const Restaurant = require('../models/restaurantModel');
const MenuItem = require('../models/menuItemModel');

// Create a new restaurant
exports.createRestaurant = async (req, res) => {
    try {
        const restaurant = new Restaurant({
            name: req.body.name,
            location: req.body.location,
            userId: req.body.userId,
        });
        await restaurant.save();
        res.status(201).send({
            success: true,
            message: 'Restaurant created successfully',
            data: restaurant,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error creating restaurant',
            error,
        });
    }
};

// Update restaurant details
exports.updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.restaurantId, req.body, {
            new: true,
        });
        res.status(200).send({
            success: true,
            message: 'Restaurant updated successfully',
            data: restaurant,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error updating restaurant',
            error,
        });
    }
};

exports.addMenuItem = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.restaurantId)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid restaurant ID',
            });
        }

        const menuItem = new MenuItem({
            restaurantId: req.params.restaurantId,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category.toLowerCase(),
            availability: req.body.availability,
        });
        await menuItem.save();
        res.status(201).send({
            success: true,
            message: 'Menu item added successfully',
            data: menuItem,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error adding menu item',
            error,
        });
    }
};


// Update a specific menu item
exports.updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(req.params.itemId, req.body, {
            new: true,
        });
        res.status(200).send({
            success: true,
            message: 'Menu item updated successfully',
            data: menuItem,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error updating menu item',
            error,
        });
    }
};
