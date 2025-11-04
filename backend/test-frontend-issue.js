const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testFrontendFlow() {
    console.log('🔍 Testing Frontend API Flow\n');

    try {
        // Test what happens when frontend gets menu items
        console.log('1️⃣ Testing GET /api/menu (like frontend does)...');
        const menuResponse = await axios.get(`${BASE_URL}/menu`);
        
        console.log('✅ Menu items response:');
        console.log('   Status:', menuResponse.status);
        console.log('   Count:', menuResponse.data.count);
        console.log('   Success:', menuResponse.data.success);
        
        if (menuResponse.data.data && menuResponse.data.data.length > 0) {
            console.log('   Sample items:');
            menuResponse.data.data.slice(0, 3).forEach((item, index) => {
                console.log(`     ${index + 1}. ${item.name} (${item.category}) - $${item.price}`);
            });
        }

        // Test categories endpoint
        console.log('\n2️⃣ Testing GET /api/categories...');
        const categoriesResponse = await axios.get(`${BASE_URL}/categories`);
        console.log('✅ Categories response:');
        console.log('   Status:', categoriesResponse.status);
        console.log('   Count:', categoriesResponse.data.count);
        console.log('   Success:', categoriesResponse.data.success);

        // Test a POST without authentication (should fail)
        console.log('\n3️⃣ Testing POST without authentication (should fail)...');
        try {
            await axios.post(`${BASE_URL}/menu`, {
                name: 'Test Item',
                category: 'Pizza',
                price: 10.99,
                description: 'Test description'
            });
            console.log('❌ Unexpected: POST without auth succeeded');
        } catch (error) {
            console.log('✅ Expected: POST without auth failed');
            console.log('   Status:', error.response?.status || 'No response');
            console.log('   Message:', error.response?.data?.message || error.message);
        }

    } catch (error) {
        console.error('❌ Error during testing:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }

    console.log('\n🎉 Frontend flow testing completed!');
}

testFrontendFlow();