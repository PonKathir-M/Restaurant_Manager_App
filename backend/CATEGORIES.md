# Restaurant Menu Categories

Your restaurant menu manager now supports **75+ comprehensive categories** organized into logical groups:

## 🥗 Starters & Small Plates
- **Appetizer** - Traditional appetizers and finger foods
- **Soup** - All types of soups (hot, cold, cream-based, broth-based)
- **Salad** - Green salads, pasta salads, grain salads
- **Bread & Rolls** - Bread baskets, garlic bread, dinner rolls
- **Small Plates** - Tapas-style small portions
- **Tapas** - Spanish-style small dishes
- **Mezze** - Mediterranean small plates

## 🍖 Main Courses
- **Main Course** - General main dishes
- **Seafood** - Fish, shrimp, crab, lobster, etc.
- **Chicken** - All chicken preparations
- **Beef** - Steaks, roasts, beef dishes
- **Pork** - Pork chops, tenderloin, ham
- **Lamb** - Lamb chops, leg of lamb, etc.
- **Vegetarian** - Meat-free main dishes
- **Vegan** - Plant-based main courses
- **Pasta** - All pasta dishes
- **Pizza** - All pizza varieties
- **Rice Dishes** - Risotto, fried rice, rice bowls
- **Noodles** - Asian noodle dishes, ramen
- **Stir Fry** - Wok-cooked dishes
- **Curry** - All curry varieties
- **Grill** - Grilled items
- **BBQ** - Barbecue and smoked items

## 🌍 International Cuisine
- **Italian** - Italian specialties
- **Chinese** - Chinese cuisine
- **Indian** - Indian dishes and curries
- **Mexican** - Mexican and Tex-Mex
- **Thai** - Thai cuisine
- **Japanese** - Sushi, ramen, Japanese dishes
- **Korean** - Korean cuisine
- **Mediterranean** - Mediterranean dishes
- **French** - French cuisine
- **American** - American comfort food

## 🥤 Beverages
- **Beverage** - General beverages
- **Coffee** - All coffee drinks
- **Tea** - Hot and iced teas
- **Juice** - Fresh and bottled juices
- **Smoothie** - Blended fruit smoothies
- **Milkshake** - Ice cream-based shakes
- **Cocktail** - Alcoholic mixed drinks
- **Beer** - All beer varieties
- **Wine** - Red, white, sparkling wines
- **Soft Drink** - Sodas and carbonated drinks
- **Water** - Still and sparkling water

## 🍰 Desserts & Sweets
- **Dessert** - General desserts
- **Ice Cream** - Ice cream and gelato
- **Cake** - All cake varieties
- **Pastry** - Pastries, danishes, croissants
- **Pie** - Fruit pies, cream pies
- **Cookies** - All cookie types
- **Chocolate** - Chocolate specialties
- **Fruit** - Fresh fruit plates, fruit salads

## 🥞 Breakfast & Brunch
- **Breakfast** - Morning meals
- **Brunch** - Late morning/early afternoon meals
- **Eggs** - Egg dishes (scrambled, benedict, etc.)
- **Pancakes** - All pancake varieties
- **Waffles** - Belgian waffles, etc.
- **Cereal** - Breakfast cereals
- **Yogurt** - Yogurt parfaits, Greek yogurt

## 🥨 Snacks & Sides
- **Snack** - Light snacks and bites
- **Side Dish** - Accompaniments to main dishes
- **Chips** - Potato chips, corn chips, etc.
- **Nuts** - Mixed nuts, roasted nuts
- **Cheese** - Cheese plates, cheese sticks

## ⭐ Special Categories
- **Kids Menu** - Child-friendly portions and dishes
- **Healthy Options** - Low-calorie, nutritious choices
- **Gluten Free** - Gluten-free menu items
- **Dairy Free** - Dairy-free options
- **Low Carb** - Keto and low-carbohydrate dishes
- **Seasonal Special** - Limited-time seasonal items
- **Chef Special** - Chef's signature dishes
- **Daily Special** - Rotating daily specials

## 🔧 API Endpoints

### Get All Categories
```
GET /api/categories
```
Returns all 75+ available categories

### Get Menu Items by Category
```
GET /api/menu/category/:category
```
Example: `GET /api/menu/category/Pizza`

### Standard CRUD Operations
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create new menu item
- `GET /api/menu/:id` - Get single menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

## 💡 Usage Tips
1. Use specific categories for better organization (e.g., "Pizza" instead of "Main Course")
2. Combine dietary categories with food types (e.g., "Vegan" + "Pasta")
3. Use special categories for marketing (e.g., "Chef Special", "Seasonal Special")
4. International categories help organize diverse menus
5. Beverage subcategories make drink menus more navigable