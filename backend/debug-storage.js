const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';

// Test the complete flow
async function debugStorage() {
    console.log('🔍 Debug: Testing complete storage flow\n');

    try {
        // Step 1: Test login
        console.log('1️⃣ Testing login...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            username: 'Kathir',
            password: 'Kathir123'
        });

        if (!loginResponse.data.success) {
            console.log('❌ Login failed:', loginResponse.data.message);
            return;
        }

        console.log('✅ Login successful, token received');
        const token = loginResponse.data.token;

        // Step 2: Test creating a menu item
        console.log('\n2️⃣ Testing menu item creation...');
        const testItem = {
            name: 'Debug Test Pizza',
            category: 'Pizza',
            price: 15.99,
            description: 'Test pizza to debug storage issues',
            isVegetarian: false,
            isAvailable: true
        };

        const createResponse = await axios.post(`${BASE_URL}/menu`, testItem, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Create response status:', createResponse.status);
        console.log('✅ Create response:', createResponse.data);

        // Step 3: Test getting all menu items
        console.log('\n3️⃣ Testing get all menu items...');
        const getAllResponse = await axios.get(`${BASE_URL}/menu`);
        console.log('✅ Get all response:', getAllResponse.data);
        console.log('📊 Total items found:', getAllResponse.data.count);

        // Step 4: Test direct database connection
        console.log('\n4️⃣ Testing direct database query...');
        await mongoose.connect(process.env.MONGODB_URI);
        
        const menuSchema = new mongoose.Schema({
            name: String,
            category: String,
            price: Number,
            description: String,
            isVegetarian: Boolean,
            isAvailable: Boolean
        }, { timestamps: true });

        const MenuItem = mongoose.model('MenuItem', menuSchema);
        const dbItems = await MenuItem.find({});
        console.log('✅ Direct DB query - Total items:', dbItems.length);
        
        if (dbItems.length > 0) {
            console.log('📋 Sample item from DB:', {
                name: dbItems[0].name,
                category: dbItems[0].category,
                price: dbItems[0].price,
                createdAt: dbItems[0].createdAt
            });
        }

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error during testing:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }

    console.log('\n🎉 Debug testing completed!');
}

debugStorage();