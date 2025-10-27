export const fetchMenus = async () => {
    try {
        const response = await fetch('/api/menus');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching menus:', error);
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const checkStock = async (menuId) => {
    try {
        const response = await fetch(`/api/menus/${menuId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error checking stock:', error);
        throw error;
    }
};