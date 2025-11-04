const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurantDB');
        console.log('✅ MongoDB Connected:', conn.connection.host);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

connectDB();

// ============= AUTHENTICATION =============

// Hardcoded user credentials
const ADMIN_USER = {
    username: 'Kathir',
    password: 'Kathir123' // In production, this should be hashed
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required. Please login first.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token. Please login again.'
            });
        }
        req.user = user;
        next();
    });
};

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    // Check credentials
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        // Generate JWT token
        const token = jwt.sign(
            { username: username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Token expires in 24 hours
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: { username: username }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }
});

// Check if user is authenticated (optional route for frontend)
app.get('/api/verify-token', authenticateToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Token is valid',
        user: req.user
    });
});

// Menu Item Schema
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            // Starters & Small Plates
            'Appetizer',
            'Soup',
            'Salad',
            'Bread & Rolls',
            'Small Plates',
            'Tapas',
            'Mezze',
            
            // Main Courses
            'Main Course',
            'Seafood',
            'Chicken',
            'Beef',
            'Pork',
            'Lamb',
            'Vegetarian',
            'Vegan',
            'Pasta',
            'Pizza',
            'Rice Dishes',
            'Noodles',
            'Stir Fry',
            'Curry',
            'Grill',
            'BBQ',
            
            // International Cuisine
            'Italian',
            'Chinese',
            'Indian',
            'Mexican',
            'Thai',
            'Japanese',
            'Korean',
            'Mediterranean',
            'French',
            'American',
            
            // Beverages
            'Beverage',
            'Coffee',
            'Tea',
            'Juice',
            'Smoothie',
            'Milkshake',
            'Cocktail',
            'Beer',
            'Wine',
            'Soft Drink',
            'Water',
            
            // Desserts & Sweets
            'Dessert',
            'Ice Cream',
            'Cake',
            'Pastry',
            'Pie',
            'Cookies',
            'Chocolate',
            'Fruit',
            
            // Breakfast & Brunch
            'Breakfast',
            'Brunch',
            'Eggs',
            'Pancakes',
            'Waffles',
            'Cereal',
            'Yogurt',
            
            // Snacks & Sides
            'Snack',
            'Side Dish',
            'Chips',
            'Nuts',
            'Cheese',
            
            // Special Categories
            'Kids Menu',
            'Healthy Options',
            'Gluten Free',
            'Dairy Free',
            'Low Carb',
            'Seasonal Special',
            'Chef Special',
            'Daily Special'
        ]
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isVegetarian: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuSchema);

// ============= CRUD ROUTES =============

// Get all available categories
app.get('/api/categories', (req, res) => {
    const categories = [
        // Starters & Small Plates
        'Appetizer',
        'Soup',
        'Salad',
        'Bread & Rolls',
        'Small Plates',
        'Tapas',
        'Mezze',
        
        // Main Courses
        'Main Course',
        'Seafood',
        'Chicken',
        'Beef',
        'Pork',
        'Lamb',
        'Vegetarian',
        'Vegan',
        'Pasta',
        'Pizza',
        'Rice Dishes',
        'Noodles',
        'Stir Fry',
        'Curry',
        'Grill',
        'BBQ',
        
        // International Cuisine
        'Italian',
        'Chinese',
        'Indian',
        'Mexican',
        'Thai',
        'Japanese',
        'Korean',
        'Mediterranean',
        'French',
        'American',
        
        // Beverages
        'Beverage',
        'Coffee',
        'Tea',
        'Juice',
        'Smoothie',
        'Milkshake',
        'Cocktail',
        'Beer',
        'Wine',
        'Soft Drink',
        'Water',
        
        // Desserts & Sweets
        'Dessert',
        'Ice Cream',
        'Cake',
        'Pastry',
        'Pie',
        'Cookies',
        'Chocolate',
        'Fruit',
        
        // Breakfast & Brunch
        'Breakfast',
        'Brunch',
        'Eggs',
        'Pancakes',
        'Waffles',
        'Cereal',
        'Yogurt',
        
        // Snacks & Sides
        'Snack',
        'Side Dish',
        'Chips',
        'Nuts',
        'Cheese',
        
        // Special Categories
        'Kids Menu',
        'Healthy Options',
        'Gluten Free',
        'Dairy Free',
        'Low Carb',
        'Seasonal Special',
        'Chef Special',
        'Daily Special'
    ];
    
    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
    });
});

// Get menu items by category
app.get('/api/menu/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const menuItems = await MenuItem.find({ category: category }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            category: category,
            count: menuItems.length,
            data: menuItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// CREATE - Add new menu item (Protected)
app.post('/api/menu', authenticateToken, async (req, res) => {
    try {
        const menuItem = new MenuItem(req.body);
        await menuItem.save();
        res.status(201).json({
            success: true,
            data: menuItem,
            message: 'Menu item created successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// READ - Get all menu items
app.get('/api/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// READ - Get single menu item by ID
app.get('/api/menu/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        res.status(200).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// UPDATE - Update menu item (Protected)
app.put('/api/menu/:id', authenticateToken, async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        res.status(200).json({
            success: true,
            data: menuItem,
            message: 'Menu item updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// DELETE - Delete menu item (Protected)
app.delete('/api/menu/:id', authenticateToken, async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});