const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const handleResponse = async (response) => {
    if (response.ok) {
        return response.json();
    }
    const errorBody = await response.json().catch(() => ({ error: 'An unknown error occurred.' }));
    const error = new Error(errorBody.error || 'Network response was not ok');
    error.response = response;
    error.body = errorBody;
    throw error;
};

export const fetchMenus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/menus`);
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching menus:', error);
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error creating order:', error.body ? error.body.error : error.message);
        throw error;
    }
};

// --- Admin APIs ---

export const getAdminSummary = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/summary`);
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching admin summary:', error);
        throw error;
    }
};

export const getMenusForAdmin = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/menus`);
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching menus for admin:', error);
        throw error;
    }
};

export const getOrders = async (status) => {
    try {
        const url = status ? `${API_BASE_URL}/api/orders?status=${status}` : `${API_BASE_URL}/api/orders`;
        const response = await fetch(url);
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

export const updateMenuStock = async (menuId, stockUpdate) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/menus/${menuId}/stock`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stockUpdate),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error updating menu stock:', error);
        throw error;
    }
};

export const cancelOrder = async (orderId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
            method: 'PATCH',
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error cancelling order:', error);
        throw error;
    }
};