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

// Save contact form data
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert contact data into the database
    const [result] = await pool.execute(
      'INSERT INTO contact_form (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    res.status(201).json({ message: 'Message sent successfully', contactId: result.insertId });
  } catch (error) {
    console.error('Error saving contact form data:', error);
    res.status(500).json({ error: 'Error saving contact form data', details: error.message });
  }
});


// Update car by ID
app.put('/api/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      car_name, car_model, car_year, location, address, price, type, sold, image
    } = req.body;

    if (!car_name || !car_model || !car_year || !location || !address || !price || !type || sold === undefined || !image) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await pool.execute(
      'UPDATE cars SET car_name = ?, car_model = ?, car_year = ?, location = ?, address = ?, price = ?, type = ?, sold = ?, image = ? WHERE id = ?',
      [car_name, car_model, car_year, location, address, price, type, sold, image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Car with ID ${id} not found` });
    }

    res.json({ message: 'Car updated successfully' });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ error: 'Error updating car', details: error.message });
  }
});

// Delete car by ID
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM cars WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Car with ID ${id} not found` });
    }

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Error deleting car', details: error.message });
  }
});

// Add new car at /addcar endpoint
app.post('/api/addcar', async (req, res) => {
  try {
    const {
      car_name, car_model, car_year, location, address, price, type, sold, image
    } = req.body;

    if (!car_name || !car_model || !car_year || !location || !address || !price || !type || sold === undefined || !image) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await pool.execute(
      'INSERT INTO cars (car_name, car_model, car_year, location, address, price, type, sold, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [car_name, car_model, car_year, location, address, price, type, sold, image]
    );

    console.log('Car added successfully:', result); // Log the successful addition for debugging
    res.status(201).json({ message: 'Car added successfully', carId: result.insertId });
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({ error: 'Error adding car', details: error.message });
  }
});

// Start Vite dev server
const vite = await createServer({
  server: { middlewareMode: true }
});
app.use(vite.middlewares);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
