const axios = require('axios').default;
const BASE_URL = 'http://localhost:5000/api';

// Test authentication system
const testAuth = async () => {
    console.log('🔐 Testing Authentication System\n');

    try {
        // Test 1: Login with correct credentials
        console.log('1️⃣ Testing login with correct credentials...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            username: 'Kathir',
            password: 'Kathir123'
        });

        if (loginResponse.data.success) {
            console.log('✅ Login successful!');
            console.log('Token received:', loginResponse.data.token.substring(0, 20) + '...');
            
            const token = loginResponse.data.token;
            
            // Test 2: Access protected route with token
            console.log('\n2️⃣ Testing protected route with valid token...');
            const protectedResponse = await axios.post(`${BASE_URL}/menu`, {
                name: 'Test Authenticated Item',
                category: 'Pizza',
                price: 15.99,
                description: 'This item was created with authentication'
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (protectedResponse.data.success) {
                console.log('✅ Protected route access successful!');
                console.log('Created item:', protectedResponse.data.data.name);
            }
            
            // Test 3: Verify token endpoint
            console.log('\n3️⃣ Testing token verification...');
            const verifyResponse = await axios.get(`${BASE_URL}/verify-token`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (verifyResponse.data.success) {
                console.log('✅ Token verification successful!');
                console.log('Verified user:', verifyResponse.data.user.username);
            }
        }

    } catch (error) {
        if (error.response) {
            console.log('❌ Error:', error.response.data.message);
        } else {
            console.log('❌ Network Error:', error.message);
        }
    }

    // Test 4: Login with wrong credentials
    console.log('\n4️⃣ Testing login with wrong credentials...');
    try {
        await axios.post(`${BASE_URL}/login`, {
            username: 'Wrong',
            password: 'Wrong123'
        });
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('✅ Correctly rejected wrong credentials');
            console.log('Message:', error.response.data.message);
        }
    }

    // Test 5: Access protected route without token
    console.log('\n5️⃣ Testing protected route without token...');
    try {
        await axios.post(`${BASE_URL}/menu`, {
            name: 'Unauthorized Item',
            category: 'Pizza',
            price: 15.99,
            description: 'This should fail'
        });
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('✅ Correctly blocked unauthorized access');
            console.log('Message:', error.response.data.message);
        }
    }

    // Test 6: Public routes still work (no auth required)
    console.log('\n6️⃣ Testing public routes (should work without auth)...');
    try {
        const publicResponse = await axios.get(`${BASE_URL}/menu`);
        console.log('✅ Public route accessible');
        console.log('Menu items count:', publicResponse.data.count);
        
        const categoriesResponse = await axios.get(`${BASE_URL}/categories`);
        console.log('✅ Categories route accessible');
        console.log('Categories count:', categoriesResponse.data.count);
    } catch (error) {
        console.log('❌ Public route error:', error.message);
    }

    console.log('\n🎉 Authentication testing completed!');
};

// Run the test
testAuth();