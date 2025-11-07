import React from 'react';

const MenuTabs = ({ categories = [], value, onChange }) => {
  return (
    <div className="tabs">
      {categories.map(cat => (
        <button
          key={cat.id}
          type="button"
          className={`tab${value === cat.id ? ' active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default MenuTabs;