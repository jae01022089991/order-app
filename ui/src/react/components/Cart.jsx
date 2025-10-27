import React from 'react';

const Cart = ({ items, onRemove, onCreateOrder }) => {
  const calcItemPrice = (cartItem) => {
    const optionsPrice = cartItem.selectedOptions.reduce((sum, option) => sum + option.price, 0);
    return (cartItem.item.price + optionsPrice) * cartItem.qty;
  };

  const total = items.reduce((sum, item) => sum + calcItemPrice(item), 0);

  const getOptionNames = (cartItem) => {
    if (!cartItem.selectedOptions || cartItem.selectedOptions.length === 0) {
      return '';
    }
    return ` (${cartItem.selectedOptions.map(o => o.name).join(', ')})`;
  };

  return (
    <aside className="cart">
      <div className="cart-columns">
        <div className="cart-left">
          <h3>주문 내역</h3>
          <div className="cart-list">
            {items.length === 0 && <div className="empty">장바구니가 비어있습니다.</div>}
            {items.map((it) => (
              <div key={it.key} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-name">{it.item.name}{getOptionNames(it)}</div>
                  <div className="cart-qty">x {it.qty}</div>
                </div>
                <div className="cart-price">{calcItemPrice(it).toLocaleString()}원</div>
                <button className="remove-item-btn" onClick={() => onRemove(it.key)}>X</button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-right">
          <h3>결제</h3>
          <div className="cart-total">
            <div className="total-label">총 금액</div>
            <div className="total-amount">{total.toLocaleString()}원</div>
          </div>
          <button 
            className="button order-button" 
            onClick={onCreateOrder} 
            disabled={items.length === 0}
          >
            주문하기
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Cart;