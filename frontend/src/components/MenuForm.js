import React, { useState, useEffect } from 'react';

const MenuForm = ({ onSubmit, editingItem, onCancelEdit, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Appetizer',
    price: '',
    description: '',
    isVegetarian: false,
    isAvailable: true
  });

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    }
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      onSubmit(editingItem._id, formData);
    } else {
      onSubmit(formData);
    }
    resetForm();
  };

const resetForm = () => {
    setFormData({
      name: '',
      category: 'Appetizer',
      price: '',
      description: '',
      isVegetarian: false,
      isAvailable: true
    });
    onCancelEdit();
  };

  // Don't render form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="menu-form-container">
        <h2>🔒 Admin Access Required</h2>
        <p style={{textAlign: 'center', color: '#666', padding: '20px'}}>
          Please login to manage menu items. You can view the menu below.
        </p>
      </div>
    );
  }

  return (
    <div className="menu-form-container">
      <h2>{editingItem ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}</h2>
      <form onSubmit={handleSubmit} className="menu-form">
        <div className="form-group">
          <label>Dish Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Margherita Pizza"
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {/* Starters & Small Plates */}
            <option value="Appetizer">Appetizer</option>
            <option value="Soup">Soup</option>
            <option value="Salad">Salad</option>
            <option value="Bread & Rolls">Bread & Rolls</option>
            <option value="Small Plates">Small Plates</option>
            <option value="Tapas">Tapas</option>
            <option value="Mezze">Mezze</option>
            
            {/* Main Courses */}
            <option value="Main Course">Main Course</option>
            <option value="Seafood">Seafood</option>
            <option value="Chicken">Chicken</option>
            <option value="Beef">Beef</option>
            <option value="Pork">Pork</option>
            <option value="Lamb">Lamb</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Pasta">Pasta</option>
            <option value="Pizza">Pizza</option>
            <option value="Rice Dishes">Rice Dishes</option>
            <option value="Noodles">Noodles</option>
            <option value="Stir Fry">Stir Fry</option>
            <option value="Curry">Curry</option>
            <option value="Grill">Grill</option>
            <option value="BBQ">BBQ</option>
            
            {/* International Cuisine */}
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
            <option value="Indian">Indian</option>
            <option value="Mexican">Mexican</option>
            <option value="Thai">Thai</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="French">French</option>
            <option value="American">American</option>
            
            {/* Beverages */}
            <option value="Beverage">Beverage</option>
            <option value="Coffee">Coffee</option>
            <option value="Tea">Tea</option>
            <option value="Juice">Juice</option>
            <option value="Smoothie">Smoothie</option>
            <option value="Milkshake">Milkshake</option>
            <option value="Cocktail">Cocktail</option>
            <option value="Beer">Beer</option>
            <option value="Wine">Wine</option>
            <option value="Soft Drink">Soft Drink</option>
            <option value="Water">Water</option>
            
            {/* Desserts & Sweets */}
            <option value="Dessert">Dessert</option>
            <option value="Ice Cream">Ice Cream</option>
            <option value="Cake">Cake</option>
            <option value="Pastry">Pastry</option>
            <option value="Pie">Pie</option>
            <option value="Cookies">Cookies</option>
            <option value="Chocolate">Chocolate</option>
            <option value="Fruit">Fruit</option>
            
            {/* Breakfast & Brunch */}
            <option value="Breakfast">Breakfast</option>
            <option value="Brunch">Brunch</option>
            <option value="Eggs">Eggs</option>
            <option value="Pancakes">Pancakes</option>
            <option value="Waffles">Waffles</option>
            <option value="Cereal">Cereal</option>
            <option value="Yogurt">Yogurt</option>
            
            {/* Snacks & Sides */}
            <option value="Snack">Snack</option>
            <option value="Side Dish">Side Dish</option>
            <option value="Chips">Chips</option>
            <option value="Nuts">Nuts</option>
            <option value="Cheese">Cheese</option>
            
            {/* Special Categories */}
            <option value="Kids Menu">Kids Menu</option>
            <option value="Healthy Options">Healthy Options</option>
            <option value="Gluten Free">Gluten Free</option>
            <option value="Dairy Free">Dairy Free</option>
            <option value="Low Carb">Low Carb</option>
            <option value="Seasonal Special">Seasonal Special</option>
            <option value="Chef Special">Chef Special</option>
            <option value="Daily Special">Daily Special</option>
          </select>
        </div>

        <div className="form-group">
          <label>Price ($) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g., 12.99"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the dish..."
            rows="3"
            required
          />
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isVegetarian"
              checked={formData.isVegetarian}
              onChange={handleChange}
            />
            🥗 Vegetarian
          </label>

          <label>
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            ✅ Available
          </label>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-submit">
            {editingItem ? 'Update Item' : 'Add Item'}
          </button>
          {editingItem && (
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MenuForm;