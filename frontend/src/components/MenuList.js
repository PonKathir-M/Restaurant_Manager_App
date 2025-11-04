import React from 'react';
import MenuItem from './MenuItem';

const MenuList = ({ menuItems, onEdit, onDelete, groupByCategory = false, isReadOnly = false }) => {
  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="empty-state">
        <h3>No menu items found</h3>
        <p>Try adjusting your filters or add your first item.</p>
      </div>
    );
  }

  if (!groupByCategory) {
    return (
      <div className="menu-list-container">
        <h2>📋 Menu Items ({menuItems.length})</h2>
        <div className="menu-grid">
          {menuItems.map(item => (
            <MenuItem
              key={item._id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              isReadOnly={isReadOnly}
            />
          ))}
        </div>
      </div>
    );
  }

  // Group by category
  const groups = menuItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groups);

  return (
    <div className="menu-list-container">
      <h2>📋 Menu Items by Category</h2>
      {categories.map(cat => (
        <section key={cat} className="category-section">
          <h3 className="category-title">{cat} ({groups[cat].length})</h3>
          <div className="menu-grid">
            {groups[cat].map(item => (
              <MenuItem
                key={item._id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                isReadOnly={isReadOnly}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MenuList;
