import React, { useState } from 'react';
import '../styles/admin.css';

// Mock Data based on PRD
const summaryData = {
  total: 120,
  received: 5,
  inProgress: 8,
  completed: 107,
};

const initialInventory = [
  { id: 1, name: '아메리카노(ICE)', stock: 100 },
  { id: 2, name: '아메리카노(HOT)', stock: 4 },
  { id: 3, name: '카페라떼', stock: 0 },
];

const initialOrders = [
  { id: 'a123', createdAt: '2025-10-27 14:23', items: '아메리카노(ICE) x 2', total: 8000, status: '주문 접수' },
  { id: 'b456', createdAt: '2025-10-27 14:21', items: '카페라떼 x 1 (시럽 추가)', total: 5000, status: '주문 접수' },
  { id: 'c789', createdAt: '2025-10-27 14:15', items: '아메리카노(HOT) x 1', total: 4000, status: '제조 중' },
];

const Admin = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [orders, setOrders] = useState(initialOrders);

  const getStockStatus = (stock) => {
    if (stock === 0) return <span className="stock-status out-of-stock">품절</span>;
    if (stock < 5) return <span className="stock-status warning">주의</span>;
    return <span className="stock-status normal">정상</span>;
  };

  const handleStockChange = (itemId, delta) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, stock: Math.max(0, item.stock + delta) } // Prevent negative stock
          : item
      )
    );
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="admin-page">
      <h1>관리자 화면</h1>

      <section className="admin-section">
        <h2>관리자 대시보드</h2>
        <div className="dashboard">
          <div className="dashboard-item">
            <div className="dashboard-title">총 주문 수</div>
            <div className="dashboard-value">{summaryData.total}</div>
          </div>
          <div className="dashboard-item">
            <div className="dashboard-title">주문 접수</div>
            <div className="dashboard-value">{summaryData.received}</div>
          </div>
          <div className="dashboard-item">
            <div className="dashboard-title">제조 중</div>
            <div className="dashboard-value">{summaryData.inProgress}</div>
          </div>
          <div className="dashboard-item">
            <div className="dashboard-title">제조 완료</div>
            <div className="dashboard-value">{summaryData.completed}</div>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>재고 현황</h2>
        <div className="inventory-list">
          {inventory.map(item => (
            <div key={item.id} className="inventory-item">
              <div className="inventory-name">{item.name}</div>
              <div className="inventory-stock">
                {getStockStatus(item.stock)}
                <span>{item.stock}개</span>
              </div>
              <div className="inventory-controls">
                <button onClick={() => handleStockChange(item.id, 1)}>+</button>
                <button onClick={() => handleStockChange(item.id, -1)}>-</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>주문 현황</h2>
        <div className="order-list">
          <div className="order-item header">
            <div>주문 시간</div>
            <div>주문 메뉴</div>
            <div>금액</div>
            <div>상태</div>
            <div>작업</div>
          </div>
          {orders.map(order => (
            <div key={order.id} className="order-item">
              <div>{order.createdAt}</div>
              <div>{order.items}</div>
              <div>{order.total.toLocaleString()}원</div>
              <div>{order.status}</div>
              <div>
                {order.status === '주문 접수' && (
                  <button className="action-btn" onClick={() => handleStatusChange(order.id, '제조 중')}>
                    제조 시작
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Admin;
