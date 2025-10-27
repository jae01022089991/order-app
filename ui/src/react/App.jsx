import React, { useState } from 'react';
import Header from './components/Header';
import MenuCard from './components/MenuCard';
import Cart from './components/Cart';
import './styles/app.css';

const sampleMenu = [
    { id: 1, name: '아메리카노(ICE)', price: 4000, desc: '깔끔한 에스프레소에 시원한 얼음이 더해진 기본 아메리카노', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: '아메리카노(HOT)', price: 4000, desc: '따뜻한 아메리카노로 하루를 시작하세요', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: '카페라떼', price: 5000, desc: '부드러운 우유와 에스프레소의 조화', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80' },
]

const App = () => {
    const [menu] = useState(sampleMenu)
    const [cart, setCart] = useState([])

    const handleAddToCart = (item, options) => {
        // merge by id + options simple logic
        const key = `${item.id}-${options?.shot ? 's' : 'n'}-${options?.syrup ? 'y' : 'n'}`
        setCart(prev => {
            const existing = prev.find(p => p.key === key)
            if (existing) {
                return prev.map(p => p.key === key ? { ...p, qty: (p.qty || 1) + 1 } : p)
            }
            return [...prev, { key, id: item.id, name: item.name, price: item.price, options, qty: 1 }]
        })
    }

    const handleRemoveItem = (itemKey) => {
        setCart(prev => prev.filter(item => item.key !== itemKey))
    }

        return (
            <div className="app-root">
                <Header />
                <div className="frame container">
                            <main>
                                <section className="menu-row" id="order">
                                    {menu.map(it => (
                                        <MenuCard key={it.id} item={it} onAdd={handleAddToCart} />
                                    ))}
                                </section>

                                <section className="cart-wrap">
                                    <Cart items={cart} onRemove={handleRemoveItem} />
                                </section>
                            </main>
                        </div>
            </div>
        );
};

export default App;