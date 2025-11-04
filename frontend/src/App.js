import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import MenuList from './components/MenuList';
import MenuForm from './components/MenuForm';
import Login from './components/Login';
import { menuAPI, categoriesAPI, isAuthenticated, getCurrentUser, logout } from './utils/api';

function App() {
  // Authentication state
  const [user, setUser] = useState(getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // Category filter state
  const [categoryFilter, setCategoryFilter] = useState('All');
  // Additional filters and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('None');
  // Price range
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  // Grouped view
  const [groupByCategory, setGroupByCategory] = useState(false);
  // Pagination
  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);

  // Authentication handlers
  const handleLogin = (userData, token) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  // Fetch all menu items
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await menuAPI.getAll();
      setMenuItems(response.data.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      alert('Failed to fetch menu items');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Build category options from current items
  const categories = useMemo(() => {
    const unique = Array.from(new Set(menuItems.map(i => i.category)));
    return ['All', ...unique];
  }, [menuItems]);

  // Derive filtered + sorted list
  const filteredItems = useMemo(() => {
    let items = [...menuItems];

    // Category
    if (categoryFilter !== 'All') {
      items = items.filter(item => item.category === categoryFilter);
    }

    // Veg only
    if (vegOnly) {
      items = items.filter(item => item.isVegetarian);
    }

    // Available only
    if (availableOnly) {
      items = items.filter(item => item.isAvailable);
    }

    // Price range
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) {
      items = items.filter(item => item.price >= min);
    }
    if (!isNaN(max)) {
      items = items.filter(item => item.price <= max);
    }

    // Text search in name or description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'PriceLow':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'PriceHigh':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'NameAZ':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'NameZA':
        items.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break; // None
    }

    return items;
  }, [menuItems, categoryFilter, vegOnly, availableOnly, searchQuery, sortBy, minPrice, maxPrice]);

  // Pagination derived from filtered items (disabled when grouped)
  const totalPages = useMemo(() => {
    if (groupByCategory) return 1;
    return Math.max(1, Math.ceil(filteredItems.length / pageSize));
  }, [filteredItems.length, pageSize, groupByCategory]);

  const pageItems = useMemo(() => {
    if (groupByCategory) return filteredItems;
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize, groupByCategory]);

  useEffect(() => {
    // Reset to first page when filters change or pageSize changes
    setPage(1);
  }, [categoryFilter, searchQuery, vegOnly, availableOnly, sortBy, minPrice, maxPrice, pageSize, groupByCategory]);

  // CSV export of current filtered list
  const exportCsv = () => {
    const header = ['Name','Category','Price','Description','Vegetarian','Available'];
    const rows = filteredItems.map(i => [
      i.name,
      i.category,
      i.price,
      i.description.replace(/\n/g, ' '),
      i.isVegetarian ? 'Yes' : 'No',
      i.isAvailable ? 'Yes' : 'No'
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Create new menu item (requires authentication)
  const createMenuItem = async (itemData) => {
    if (!isLoggedIn) {
      alert('❌ Please login to add menu items');
      return;
    }
    
    try {
      const response = await menuAPI.create(itemData);
      // Refresh all data from server to ensure UI is updated
      await fetchMenuItems();
      alert('✅ Menu item added successfully!');
    } catch (error) {
      console.error('Error creating menu item:', error);
      if (error.response?.status === 401) {
        alert('❌ Please login to add menu items');
      } else {
        alert('❌ Failed to add menu item');
      }
    }
  };

  // Update menu item (requires authentication)
  const updateMenuItem = async (id, itemData) => {
    if (!isLoggedIn) {
      alert('❌ Please login to update menu items');
      return;
    }
    
    try {
      const response = await menuAPI.update(id, itemData);
      // Refresh all data from server to ensure UI is updated
      await fetchMenuItems();
      setEditingItem(null);
      alert('✅ Menu item updated successfully!');
    } catch (error) {
      console.error('Error updating menu item:', error);
      if (error.response?.status === 401) {
        alert('❌ Please login to update menu items');
      } else {
        alert('❌ Failed to update menu item');
      }
    }
  };

  // Delete menu item (requires authentication)
  const deleteMenuItem = async (id) => {
    if (!isLoggedIn) {
      alert('❌ Please login to delete menu items');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await menuAPI.delete(id);
        // Refresh all data from server to ensure UI is updated
        await fetchMenuItems();
        alert('✅ Menu item deleted successfully!');
      } catch (error) {
        console.error('Error deleting menu item:', error);
        if (error.response?.status === 401) {
          alert('❌ Please login to delete menu items');
        } else {
          alert('❌ Failed to delete menu item');
        }
      }
    }
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return (
      <div className="App">
        <header className="app-header">
          <h1>🍽️ Restaurant Menu Manager</h1>
          <p>View our menu or login to manage items</p>
        </header>
        
        {/* Show login overlay */}
        <Login onLogin={handleLogin} />
        
        {/* Show menu in read-only mode */}
        <div className="container">
          {/* Filters (read-only) */}
          <div className="filters-bar">
            <label htmlFor="categoryFilter">Category:</label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <label htmlFor="search">Search:</label>
            <input
              id="search"
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <label>Price:</label>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{width:'80px'}}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{width:'80px'}}
            />

            <label>
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
              />
              Veg only
            </label>

            <label>
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              Available only
            </label>

            <label htmlFor="sortBy">Sort:</label>
            <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="None">None</option>
              <option value="PriceLow">Price: Low → High</option>
              <option value="PriceHigh">Price: High → Low</option>
              <option value="NameAZ">Name: A → Z</option>
              <option value="NameZA">Name: Z → A</option>
            </select>

            <label>
              <input
                type="checkbox"
                checked={groupByCategory}
                onChange={(e) => setGroupByCategory(e.target.checked)}
              />
              Group by category
            </label>

            <button className="btn-submit" onClick={exportCsv} type="button">Export CSV</button>

            {!groupByCategory && (
              <>
                <label htmlFor="pageSize">Per page:</label>
                <select id="pageSize" value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value)||8)}>
                  <option value={6}>6</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </>
            )}
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              <MenuList
                menuItems={groupByCategory ? filteredItems : pageItems}
                groupByCategory={groupByCategory}
                onEdit={null} // Disable editing for non-logged in users
                onDelete={null} // Disable deleting for non-logged in users
                isReadOnly={true}
              />

              {!groupByCategory && (
                <div className="pagination">
                  <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                  <span>Page {page} of {totalPages}</span>
                  <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🍽️ Restaurant Menu Manager</h1>
        <p>Manage your restaurant menu with CRUD operations</p>
        <div className="auth-info">
          <span>Welcome, {user?.username}! </span>
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </div>
      </header>

      <div className="container">
        <MenuForm
          onSubmit={editingItem ? updateMenuItem : createMenuItem}
          editingItem={editingItem}
          onCancelEdit={() => setEditingItem(null)}
          isAuthenticated={isLoggedIn}
        />

        {/* Filters */}
        <div className="filters-bar">
          <label htmlFor="categoryFilter">Category:</label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label htmlFor="search">Search:</label>
          <input
            id="search"
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <label>Price:</label>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{width:'80px'}}
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{width:'80px'}}
          />

          <label>
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
            />
            Veg only
          </label>

          <label>
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />
            Available only
          </label>

          <label htmlFor="sortBy">Sort:</label>
          <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="None">None</option>
            <option value="PriceLow">Price: Low → High</option>
            <option value="PriceHigh">Price: High → Low</option>
            <option value="NameAZ">Name: A → Z</option>
            <option value="NameZA">Name: Z → A</option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={groupByCategory}
              onChange={(e) => setGroupByCategory(e.target.checked)}
            />
            Group by category
          </label>

          <button className="btn-submit" onClick={exportCsv} type="button">Export CSV</button>

          {!groupByCategory && (
            <>
              <label htmlFor="pageSize">Per page:</label>
              <select id="pageSize" value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value)||8)}>
                <option value={6}>6</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <MenuList
              menuItems={groupByCategory ? filteredItems : pageItems}
              groupByCategory={groupByCategory}
              onEdit={setEditingItem}
              onDelete={deleteMenuItem}
            />

            {!groupByCategory && (
              <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
