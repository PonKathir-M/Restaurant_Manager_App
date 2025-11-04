const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Import the same schema as server.js
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

// Sample menu items for different categories
const sampleMenuItems = [
    {
        name: "Caesar Salad",
        category: "Salad",
        price: 12.99,
        description: "Fresh romaine lettuce with parmesan cheese, croutons and caesar dressing",
        isVegetarian: true
    },
    {
        name: "Chicken Tikka Masala",
        category: "Indian",
        price: 18.99,
        description: "Tender chicken in a rich, creamy tomato-based curry sauce",
        isVegetarian: false
    },
    {
        name: "Margherita Pizza",
        category: "Pizza",
        price: 16.99,
        description: "Classic pizza with tomato sauce, mozzarella cheese, and fresh basil",
        isVegetarian: true
    },
    {
        name: "Pad Thai",
        category: "Thai",
        price: 15.99,
        description: "Stir-fried rice noodles with shrimp, tofu, egg, and peanuts",
        isVegetarian: false
    },
    {
        name: "Chocolate Lava Cake",
        category: "Dessert",
        price: 8.99,
        description: "Warm chocolate cake with molten center, served with vanilla ice cream",
        isVegetarian: true
    },
    {
        name: "Cappuccino",
        category: "Coffee",
        price: 4.99,
        description: "Rich espresso with steamed milk foam",
        isVegetarian: true
    }
];

const testCategories = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing menu items (optional)
        await MenuItem.deleteMany({});
        console.log('🧹 Cleared existing menu items');

        // Add sample menu items
        const createdItems = await MenuItem.insertMany(sampleMenuItems);
        console.log(`📝 Added ${createdItems.length} sample menu items`);

        // Test getting items by different categories
        console.log('\n📋 Testing category-based queries:');
        
        const categories = ['Salad', 'Indian', 'Pizza', 'Thai', 'Coffee'];
        
        for (const category of categories) {
            const items = await MenuItem.find({ category });
            console.log(`  ${category}: ${items.length} item(s)`);
            items.forEach(item => {
                console.log(`    - ${item.name} ($${item.price})`);
            });
        }

        console.log('\n✅ Category testing completed successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

testCategories();