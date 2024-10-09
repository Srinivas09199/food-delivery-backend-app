const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    createRestaurant,
    updateRestaurant,
    addMenuItem,
    updateMenuItem,
} = require('../controllers/restaurantController');

// POST  Create a new restaurant
router.post('/restaurants', authMiddleware, createRestaurant);

// PUT  Update a restaurant's details
router.put('/restaurants/:restaurantId', authMiddleware, updateRestaurant);

// POST Add items to the restaurant’s menu
router.post('/restaurants/:restaurantId/menu', authMiddleware, addMenuItem);

// PUT  Update a specific menu item
router.put('/restaurants/:restaurantId/menu/:itemId', authMiddleware, updateMenuItem);

module.exports = router;
