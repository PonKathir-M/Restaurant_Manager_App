// Simple manual test to verify authentication
console.log('🔐 Manual Authentication Test\n');

// Test JWT token generation
const jwt = require('jsonwebtoken');
require('dotenv').config();

const testCredentials = {
    username: 'Kathir',
    password: 'Kathir123'
};

console.log('Testing JWT token generation...');
const token = jwt.sign(
    { username: testCredentials.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);

console.log('✅ JWT Token generated successfully!');
console.log('Token (first 30 chars):', token.substring(0, 30) + '...');

// Test token verification
console.log('\nTesting token verification...');
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully!');
    console.log('Decoded username:', decoded.username);
} catch (error) {
    console.log('❌ Token verification failed:', error.message);
}

console.log('\n🎉 Manual test completed!\n');
console.log('📋 Your authentication setup:');
console.log('  - Username: Kathir');
console.log('  - Password: Kathir123');
console.log('  - JWT Secret: Set in .env file');
console.log('  - Token expires: 24 hours');
console.log('\n📝 Protected routes:');
console.log('  - POST /api/menu (Create menu item)');
console.log('  - PUT /api/menu/:id (Update menu item)');
console.log('  - DELETE /api/menu/:id (Delete menu item)');
console.log('\n🌍 Public routes (no auth needed):');
console.log('  - GET /api/menu (View all menu items)');
console.log('  - GET /api/menu/:id (View single menu item)');
console.log('  - GET /api/categories (View all categories)');
console.log('  - GET /api/menu/category/:category (View items by category)');
console.log('\n🔑 Authentication endpoints:');
console.log('  - POST /api/login (Login and get token)');
console.log('  - GET /api/verify-token (Verify if token is valid)');