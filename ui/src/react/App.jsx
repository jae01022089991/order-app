import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MenuCard from './components/MenuCard';
import Cart from './components/Cart';
import Admin from './pages/Admin';
import { fetchMenus, createOrder } from '../shared/api';
import './styles/app.css';

const App = () => {
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);

    const getMenus = () => {
        fetchMenus()
            .then(data => setMenu(data))
            .catch(error => console.error('Error fetching menus:', error));
    }

    useEffect(() => {
        getMenus();
    }, []);

    const handleAddToCart = (item, selectedOptions) => {
        const optionIds = selectedOptions.map(o => o.id).sort().join('-');
        const key = `${item.id}-${optionIds}`;

        setCart(prev => {
            const existing = prev.find(p => p.key === key);
            if (existing) {
                return prev.map(p => p.key === key ? { ...p, qty: p.qty + 1 } : p);
            }
            return [...prev, { key, item, selectedOptions, qty: 1 }];
        });
    };

    const handleRemoveItem = (itemKey) => {
        setCart(prev => prev.filter(item => item.key !== itemKey));
    };

    const handleCreateOrder = async () => {
        if (cart.length === 0) {
            alert('장바구니가 비어있습니다.');
            return;
        }

        const orderItems = cart.map(cartItem => ({
            menuId: cartItem.item.id,
            quantity: cartItem.qty,
            optionIds: cartItem.selectedOptions.map(o => o.id),
        }));

        const total = cart.reduce((sum, cartItem) => {
            const optionsPrice = cartItem.selectedOptions.reduce((s, o) => s + o.price, 0);
            const itemTotal = (cartItem.item.price + optionsPrice) * cartItem.qty;
            return sum + itemTotal;
        }, 0);

        const orderData = {
            items: orderItems,
            totalPrice: total,
        };

        try {
            const newOrder = await createOrder(orderData);
            alert(`주문이 완료되었습니다. (주문번호: ${newOrder.orderId})`);
            setCart([]);
            getMenus(); // Refresh menu to show updated stock
        } catch (error) {
            const errorMessage = error.body?.error || '주문 처리 중 오류가 발생했습니다.';
            alert(errorMessage);
            console.error('Error creating order:', error);
        }
    };

    const OrderPage = () => (
        <main>
            <section className="menu-row" id="order">
                {menu.map(it => (
                    <MenuCard key={it.id} item={it} onAdd={handleAddToCart} />
                ))}
            </section>
            <section className="cart-wrap">
                <Cart items={cart} onRemove={handleRemoveItem} onCreateOrder={handleCreateOrder} />
            </section>
        </main>
    );

    return (
        <BrowserRouter>
            <div className="app-root">
                <Header />
                <div className="frame container">
                    <Routes>
                        <Route path="/" element={<OrderPage />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;