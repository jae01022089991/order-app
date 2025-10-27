import React, { useState, useEffect, useCallback } from 'react';
import {
  getAdminSummary,
  getMenusForAdmin,
  getOrders,
  updateMenuStock,
  updateOrderStatus,
  cancelOrder,
} from '../../shared/api';
import '../styles/admin.css';

const Admin = () => {
  const [summary, setSummary] = useState({ total: 0, received: 0, inProgress: 0, completed: 0 });
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [summaryData, menusData, ordersData] = await Promise.all([
        getAdminSummary(),
        getMenusForAdmin(),
        getOrders(orderFilter),
      ]);
      setSummary(summaryData);
      setMenus(menusData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      alert("관리자 데이터를 불러오는 데 실패했습니다.");
    }
  }, [orderFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStockStatus = (stock) => {
    if (stock === 0) return <span className="stock-status out-of-stock">품절</span>;
    if (stock < 10) return <span className="stock-status warning">주의</span>;
    return <span className="stock-status normal">정상</span>;
  };

  const handleStockChange = async (item, delta) => {
    if (item.stock === 0 && delta < 0) {
      alert("재고가 현재 0개입니다.");
      return;
    }
    try {
      await updateMenuStock(item.id, { delta });
      getMenusForAdmin().then(setMenus);
    } catch (error) {
      alert("재고 업데이트에 실패했습니다.");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchData();
    } catch (error) {
      alert("주문 상태 변경에 실패했습니다.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("정말로 이 주문을 취소하시겠습니까? 취소된 주문은 되돌릴 수 없습니다.")) {
      return;
    }
    try {
      await cancelOrder(orderId);
      fetchData();
    } catch (error) {
      alert(`주문 취소에 실패했습니다: ${error.message}`);
    }
  };

  const formatOrderItems = (items) => {
    return items.map(item => `${item.name} x${item.qty} (${item.options})`).join(', ');
  };

  return (
    <div className="admin-page">
      <h1>관리자 화면</h1>

      <section className="admin-section">
        <h2>관리자 대시보드</h2>
        <div className="dashboard">
          <div className="dashboard-item">
            <div className="dashboard-title">총 주문 수</div>
            <div className="dashboard-value">{summary.total}</div>
          </div>
          <div className="dashboard-item">
            <div className="dashboard-title">주문 접수</div>
            <div className="dashboard-value">{summary.received}</div>
          </div>
          <div className="dashboard-item">
            <div className="dashboard-title">제조 중</div>
            <div className="dashboard-value">{summary.inProgress}</div>
          </div>
          <div className="dashboard-item">
            <div className="dashboard-title">제조 완료</div>
            <div className="dashboard-value">{summary.completed}</div>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>재고 현황</h2>
        <div className="inventory-list">
          {menus.map(item => (
            <div key={item.id} className="inventory-item">
              <div className="inventory-name">{item.name}</div>
              <div className="inventory-stock">
                {getStockStatus(item.stock)}
                <span>{item.stock}개</span>
              </div>
              <div className="inventory-controls">
                <button onClick={() => handleStockChange(item, 1)}>+1</button>
                <button onClick={() => handleStockChange(item, -1)}>-1</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>주문 현황</h2>
        <div className="order-filters">
            <button onClick={() => setOrderFilter(null)} className={!orderFilter ? 'active' : ''}>전체</button>
            <button onClick={() => setOrderFilter('주문 접수')} className={orderFilter === '주문 접수' ? 'active' : ''}>주문 접수</button>
            <button onClick={() => setOrderFilter('제조 중')} className={orderFilter === '제조 중' ? 'active' : ''}>제조 중</button>
            <button onClick={() => setOrderFilter('완료')} className={orderFilter === '완료' ? 'active' : ''}>완료</button>
            <button onClick={() => setOrderFilter('주문 취소')} className={orderFilter === '주문 취소' ? 'active' : ''}>주문 취소</button>
        </div>
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
              <div>{new Date(order.createdAt).toLocaleString()}</div>
              <div>{formatOrderItems(order.items)}</div>
              <div>{order.totalPrice.toLocaleString()}원</div>
              <div>{order.status}</div>
              <div className="order-actions">
                {order.status === '주문 접수' && (
                  <button className="action-btn" onClick={() => handleStatusChange(order.id, '제조 중')}>
                    제조 시작
                  </button>
                )}
                {order.status === '제조 중' && (
                  <>
                    <button className="action-btn" onClick={() => handleStatusChange(order.id, '완료')}>
                      제조 완료
                    </button>
                    <button className="action-btn cancel-btn" onClick={() => handleCancelOrder(order.id)}>
                      주문 취소
                    </button>
                  </>
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
