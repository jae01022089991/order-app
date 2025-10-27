import React, { useState } from 'react';

const MenuCard = ({ item, onAdd }) => {
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionChange = (optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: !prev[optionId]
    }));
  };

  const handleAdd = () => {
    const options = item.options.filter(option => selectedOptions[option.id]);
    onAdd(item, options);
  };

  return (
    <div className="menu-card">
      {item.imageUrl ? (
        <img className="menu-img" src={item.imageUrl} alt={item.name} />
      ) : (
        <div className="menu-image" aria-hidden />
      )}
      <h3 className="menu-title">{item.name}</h3>
      <div className="menu-price">{item.price.toLocaleString()}원</div>
      <p className="menu-desc">{item.description}</p>

      {item.options && item.options.length > 0 && (
        <div className="options">
          {item.options.map(option => (
            <label key={option.id}>
              <input
                type="checkbox"
                checked={!!selectedOptions[option.id]}
                onChange={() => handleOptionChange(option.id)}
              /> {option.name} (+{option.price.toLocaleString()}원)
            </label>
          ))}
        </div>
      )}

      <button className="button add-button" onClick={handleAdd}>담기</button>
    </div>
  );
};

export default MenuCard;
