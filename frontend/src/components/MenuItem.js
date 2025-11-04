import React from 'react';

const MenuItem = ({ item, onEdit, onDelete, isReadOnly = false }) => {
  return (
    <div className="menu-item-card">
      <div className="menu-item-header">
        <h3>{item.name}</h3>
        <span className={`category-badge ${item.category.toLowerCase().replace(' ', '-')}`}>
          {item.category}
        </span>
      </div>

      <p className="description">{item.description}</p>

      <div className="menu-item-details">
        <div className="price">${item.price.toFixed(2)}</div>
        <div className="badges">
          {item.isVegetarian && <span className="badge veg">🥗 Veg</span>}
          <span className={`badge ${item.isAvailable ? 'available' : 'unavailable'}`}>
            {item.isAvailable ? '✅ Available' : '❌ Unavailable'}
          </span>
        </div>
      </div>

      {!isReadOnly && onEdit && onDelete && (
        <div className="menu-item-actions">
          <button className="btn-edit" onClick={() => onEdit(item)}>
            ✏️ Edit
          </button>
          <button className="btn-delete" onClick={() => onDelete(item._id)}>
            🗑️ Delete
          </button>
        </div>
      )}
      
      {isReadOnly && (
        <div className="menu-item-actions">
          <div className="read-only-notice">
            <small style={{color: '#666', fontStyle: 'italic'}}>
              🔒 Login required to edit
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItem;