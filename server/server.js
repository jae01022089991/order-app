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

// Basic Route
app.get('/', (req, res) => {
  res.send('Hello from the Coffee Order App Backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});