require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Database Connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test DB Connection
(async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL database connected successfully.');
    const result = await client.query('SELECT NOW()');
    console.log('Current time from DB:', result.rows[0].now);
    client.release();
  } catch (err) {
    console.error('Database connection error:', err.stack);
  }
})();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to set response header for UTF-8
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Hello from the Coffee Order App Backend!');
});

// API to get all menus
app.get('/api/menus', async (req, res) => {
  try {
    const query = `
      SELECT
        m.id AS menu_id,
        m.name AS menu_name,
        m.description,
        m.price AS menu_price,
        m.image_url,
        m.stock,
        o.id AS option_id,
        o.name AS option_name,
        o.price AS option_price
      FROM menus m
      LEFT JOIN menu_options mo ON m.id = mo.menu_id
      LEFT JOIN options o ON mo.option_id = o.id
      ORDER BY m.id;
    `;
    const { rows } = await pool.query(query);

    const menus = {};
    rows.forEach(row => {
      const { menu_id, menu_name, description, menu_price, image_url, stock } = row;
      if (!menus[menu_id]) {
        menus[menu_id] = {
          id: menu_id,
          name: menu_name,
          description: description,
          price: menu_price,
          imageUrl: image_url,
          stock: stock,
          options: [],
        };
      }

      if (row.option_id) {
        menus[menu_id].options.push({
          id: row.option_id,
          name: row.option_name,
          price: row.option_price,
        });
      }
    });

    res.json(Object.values(menus));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API to create a new order
app.post('/api/orders', async (req, res) => {
  const { items, totalPrice } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Check stock and update it
    for (const item of items) {
      const stockResult = await client.query('SELECT name, stock FROM menus WHERE id = $1 FOR UPDATE', [item.menuId]);
      if (stockResult.rows.length === 0) {
        throw new Error(`Menu with id ${item.menuId} not found.`);
      }
      const currentStock = stockResult.rows[0].stock;
      const menuName = stockResult.rows[0].name;
      if (currentStock < item.quantity) {
        throw new Error(`재고가 부족합니다. (메뉴: ${menuName})`);
      }
      await client.query('UPDATE menus SET stock = stock - $1 WHERE id = $2', [item.quantity, item.menuId]);
    }

    // 2. Create the order
    const orderResult = await client.query(
      'INSERT INTO orders (total_price, status) VALUES ($1, $2) RETURNING id, created_at, status',
      [totalPrice, '제조 중']
    );
    const newOrder = orderResult.rows[0];
    const orderId = newOrder.id;

    // 3. Create order_items and order_item_options
    for (const item of items) {
      const menuPriceResult = await client.query('SELECT price FROM menus WHERE id = $1', [item.menuId]);
      let itemPrice = menuPriceResult.rows[0].price;

      let optionsPrice = 0;
      if (item.optionIds && item.optionIds.length > 0) {
        const optionsResult = await client.query('SELECT SUM(price) as total FROM options WHERE id = ANY($1::int[])', [item.optionIds]);
        optionsPrice = parseInt(optionsResult.rows[0].total, 10);
      }
      const pricePerItem = itemPrice + optionsPrice;


      const orderItemResult = await client.query(
        'INSERT INTO order_items (order_id, menu_id, quantity, price_per_item) VALUES ($1, $2, $3, $4) RETURNING id',
        [orderId, item.menuId, item.quantity, pricePerItem]
      );
      const orderItemId = orderItemResult.rows[0].id;

      if (item.optionIds && item.optionIds.length > 0) {
        const optionValues = item.optionIds.map(optionId => `(${orderItemId}, ${optionId})`).join(',');
        await client.query(`INSERT INTO order_item_options (order_item_id, option_id) VALUES ${optionValues}`);
      }
    }

    await client.query('COMMIT');
    res.status(201).json({
      orderId: newOrder.id,
      status: newOrder.status,
      createdAt: newOrder.created_at,
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    if (err.message.includes('재고가 부족합니다')) {
        res.status(400).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Internal server error while creating order' });
    }
  } finally {
    client.release();
  }
});
// API to get all orders (for admin)
app.get('/api/orders', async (req, res) => {
  const { status } = req.query;

  try {
    const query = `
      SELECT
        o.id as order_id,
        o.created_at,
        o.status,
        o.total_price,
        oi.id as order_item_id,
        oi.quantity,
        m.name as menu_name,
        opt.name as option_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN menus m ON oi.menu_id = m.id
      LEFT JOIN order_item_options oio ON oi.id = oio.order_item_id
      LEFT JOIN options opt ON oio.option_id = opt.id
      WHERE ($1::text IS NULL OR o.status = $1)
      ORDER BY o.created_at DESC, oi.id;
    `;

    const { rows } = await pool.query(query, [status || null]);

    const orders = {};
    rows.forEach(row => {
      const { order_id, created_at, status, total_price } = row;
      if (!orders[order_id]) {
        orders[order_id] = {
          id: order_id,
          createdAt: created_at,
          status: status,
          totalPrice: total_price,
          items: {},
        };
      }

      const { order_item_id, menu_name, quantity, option_name } = row;
      if (!orders[order_id].items[order_item_id]) {
        orders[order_id].items[order_item_id] = {
          name: menu_name,
          qty: quantity,
          options: [],
        };
      }

      if (option_name) {
        orders[order_id].items[order_item_id].options.push(option_name);
      }
    });

    const result = Object.values(orders).map(order => ({
      ...order,
      items: Object.values(order.items).map(item => ({
        ...item,
        options: item.options.join(', ') || '없음',
      })),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin APIs

// PATCH /api/orders/:id/status - Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ orderId: result.rows[0].id, newStatus: result.rows[0].status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/menus/:id/stock - Update menu stock
app.patch('/api/menus/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { delta, stock } = req.body;
  try {
    let query;
    let queryParams;
    if (delta !== undefined) {
      query = 'UPDATE menus SET stock = stock + $1 WHERE id = $2 RETURNING id, stock';
      queryParams = [delta, id];
    } else if (stock !== undefined) {
      query = 'UPDATE menus SET stock = $1 WHERE id = $2 RETURNING id, stock';
      queryParams = [stock, id];
    } else {
      return res.status(400).json({ error: 'Request must contain delta or stock' });
    }
    const result = await pool.query(query, queryParams);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.json({ menuId: result.rows[0].id, newStock: result.rows[0].stock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/summary - Get dashboard summary
app.get('/api/admin/summary', async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) as count FROM orders');
    const receivedResult = await pool.query('SELECT COUNT(*) as count FROM orders WHERE status = $1', ['주문 접수']);
    const inProgressResult = await pool.query('SELECT COUNT(*) as count FROM orders WHERE status = $1', ['제조 중']);
    const completedResult = await pool.query('SELECT COUNT(*) as count FROM orders WHERE status = $1', ['완료']);
    
    res.json({
      total: parseInt(totalResult.rows[0].count, 10),
      received: parseInt(receivedResult.rows[0].count, 10),
      inProgress: parseInt(inProgressResult.rows[0].count, 10),
      completed: parseInt(completedResult.rows[0].count, 10),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/menus - Get menus for admin page
app.get('/api/admin/menus', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, stock FROM menus ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/orders/:id/cancel - Cancel an order and restock items
app.patch('/api/orders/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Check current order status
    const orderStatusResult = await client.query('SELECT status FROM orders WHERE id = $1', [id]);
    if (orderStatusResult.rows.length === 0) {
      throw new Error('Order not found');
    }
    const currentStatus = orderStatusResult.rows[0].status;
    if (currentStatus === '완료' || currentStatus === '주문 취소') {
      throw new Error(`Cannot cancel an order that is already ${currentStatus}.`);
    }

    // 2. Get items from the order
    const itemsResult = await client.query('SELECT menu_id, quantity FROM order_items WHERE order_id = $1', [id]);
    const items = itemsResult.rows;

    // 3. Restore stock for each item
    for (const item of items) {
      await client.query('UPDATE menus SET stock = stock + $1 WHERE id = $2', [item.quantity, item.menu_id]);
    }

    // 4. Update order status to '주문 취소'
    const result = await client.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status',
      ['주문 취소', id]
    );

    await client.query('COMMIT');
    res.json({ orderId: result.rows[0].id, newStatus: result.rows[0].status });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error while cancelling order' });
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});