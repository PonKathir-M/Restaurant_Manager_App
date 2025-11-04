# 🔐 Restaurant Menu Manager - Authentication Guide

Your restaurant menu manager now has **secure authentication** implemented! Only authorized users can perform CRUD operations (Create, Update, Delete) on menu items.

## 📋 Authentication Details

### 👤 Login Credentials
- **Username:** `Kathir`
- **Password:** `Kathir123`

### 🔑 Authentication Method
- **Type:** JWT (JSON Web Token)
- **Token Expiry:** 24 hours
- **Header Format:** `Authorization: Bearer <token>`

## 🛡️ Route Protection

### 🔒 Protected Routes (Requires Authentication)
These routes require a valid JWT token in the Authorization header:

- **POST** `/api/menu` - Create new menu item
- **PUT** `/api/menu/:id` - Update existing menu item  
- **DELETE** `/api/menu/:id` - Delete menu item

### 🌍 Public Routes (No Authentication Required)
These routes are accessible to everyone:

- **GET** `/api/menu` - View all menu items
- **GET** `/api/menu/:id` - View single menu item
- **GET** `/api/categories` - View all available categories
- **GET** `/api/menu/category/:category` - View items by category

### 🔑 Authentication Endpoints
- **POST** `/api/login` - Login and receive JWT token
- **GET** `/api/verify-token` - Verify if current token is valid

## 📝 How to Use

### 1. Login to Get Token

**Request:**
```bash
POST /api/login
Content-Type: application/json

{
  "username": "Kathir",
  "password": "Kathir123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "Kathir"
  }
}
```

### 2. Use Token for Protected Operations

**Create Menu Item:**
```bash
POST /api/menu
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Margherita Pizza",
  "category": "Pizza",
  "price": 16.99,
  "description": "Classic pizza with tomato sauce, mozzarella, and basil",
  "isVegetarian": true
}
```

**Update Menu Item:**
```bash
PUT /api/menu/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Updated Pizza Name",
  "price": 18.99
}
```

**Delete Menu Item:**
```bash
DELETE /api/menu/:id
Authorization: Bearer <your-jwt-token>
```

### 3. Error Responses

**Unauthorized (No Token):**
```json
{
  "success": false,
  "message": "Access token required. Please login first."
}
```

**Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token. Please login again."
}
```

**Wrong Credentials:**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

## 🖥️ Frontend Implementation

### JavaScript/React Example

```javascript
// Store token after login
const login = async () => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'Kathir',
      password: 'Kathir123'
    })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('authToken', data.token);
    console.log('Logged in successfully!');
  }
};

// Use token for protected operations
const createMenuItem = async (menuItem) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('/api/menu', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(menuItem)
  });
  
  return await response.json();
};

// Check if user is logged in
const isAuthenticated = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  const response = await fetch('/api/verify-token', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.ok;
};
```

## 🚀 Testing the Authentication

### Using curl (Command Line)

```bash
# 1. Login to get token
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Kathir","password":"Kathir123"}'

# 2. Use token (replace YOUR_TOKEN with actual token from step 1)
curl -X POST http://localhost:5000/api/menu \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Pizza",
    "category": "Pizza",
    "price": 15.99,
    "description": "Test pizza with authentication"
  }'

# 3. Test without token (should fail)
curl -X POST http://localhost:5000/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Unauthorized Pizza",
    "category": "Pizza", 
    "price": 15.99,
    "description": "This should fail"
  }'
```

### Using Postman

1. **Login Request:**
   - Method: POST
   - URL: `http://localhost:5000/api/login`
   - Headers: `Content-Type: application/json`
   - Body: 
   ```json
   {
     "username": "Kathir",
     "password": "Kathir123"
   }
   ```

2. **Protected Request:**
   - Method: POST
   - URL: `http://localhost:5000/api/menu`
   - Headers: 
     - `Content-Type: application/json`
     - `Authorization: Bearer <paste-token-here>`
   - Body: Your menu item JSON

## 🔧 Server Startup

```bash
# Start your server
node server.js

# You should see:
# 🚀 Server running on http://localhost:5000
# ✅ MongoDB Connected: localhost
```

## 🛡️ Security Features

✅ **JWT Token Authentication** - Secure token-based authentication  
✅ **Token Expiry** - Tokens expire after 24 hours  
✅ **Route Protection** - Only CRUD operations are protected  
✅ **Public Read Access** - Anyone can view menu items  
✅ **Error Handling** - Clear error messages for unauthorized access  
✅ **Input Validation** - Validates username and password requirements  

## 💡 Tips for Frontend Development

1. **Store tokens securely** (localStorage or sessionStorage for development)
2. **Handle token expiry** - Redirect to login when token expires
3. **Implement logout** - Clear stored token from client
4. **Show/hide UI elements** - Based on authentication status
5. **Error handling** - Display user-friendly auth error messages

Your restaurant menu manager now has professional-grade authentication! 🎉