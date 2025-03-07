import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { createServer } from 'vite';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: '',
  port: '',
  user: '',
  password: '',
  database: ''
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Test DB connection
(async () => {
  try {
    await pool.getConnection();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
})();

// Get all cars
app.get('/api/cars', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM cars');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Error fetching cars', details: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.execute(
      'SELECT id, username FROM admins WHERE email = ? AND password = ?',
      [email, password]
    );
    if (rows.length > 0) {
      res.json({ id: rows[0].id, username: rows[0].username });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error during login', details: error.message });
  }
});