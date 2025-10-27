import React from 'react'

const Cart = ({ items, onRemove }) => {
  const calcItemPrice = (it) => {
    let price = it.price
    if (it.options?.shot) price += 500
    return price * (it.qty || 1)
  }

  const total = items.reduce((s, it) => s + calcItemPrice(it), 0)

  return (
    <aside className="cart">
      <div className="cart-columns">
        <div className="cart-left">
          <h3>주문 내역</h3>
          <div className="cart-list">
            {items.length === 0 && <div className="empty">장바구니가 비어있습니다.</div>}
            {items.map((it, idx) => (
              <div key={it.key} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-name">{it.name} {it.options?.shot ? '(샷 추가)' : ''} {it.options?.syrup ? '(시럽 추가)' : ''}</div>
                  <div className="cart-qty">x {it.qty || 1}</div>
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
          <button className="button order-button">주문하기</button>
        </div>
      </div>
    </aside>
  )
}

export default Cart
