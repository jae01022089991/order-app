
    import React, { createContext, useState, useContext } from 'react';

    const CartContext = createContext();

    export const useCart = () => useContext(CartContext);

    export const CartProvider = ({ children }) => {
      const [cart, setCart] = useState([]);

      const handleAddToCart = (item, options) => {
        const key = `${item.id}-${options?.shot ? 's' : 'n'}-${options?.syrup ? 'y' : 'n'}`;
        setCart(prev => {
            const existing = prev.find(p => p.key === key);
            if (existing) {
                return prev.map(p => p.key === key ? { ...p, qty: (p.qty || 1) + 1 } : p);
            }
            return [...prev, { key, id: item.id, name: item.name, price: item.price, options, qty: 1 }];
        });
      };

      const handleRemoveItem = (itemKey) => {
        setCart(prev => prev.filter(item => item.key !== itemKey));
      };

      // 여기에 localStorage 연동 로직을 추가할 수 있습니다.

      const value = {
        cart,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveItem,
      };

      return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
    };
    