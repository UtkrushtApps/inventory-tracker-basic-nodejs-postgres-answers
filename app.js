// app.js: Main Express API
const express = require('express');
const db = require('./db');
const { logProductAction } = require('./logger');

const app = express();
app.use(express.json());

// POST /products - Add a new product, then background log
app.post('/products', async (req, res) => {
  const { name, price, quantity } = req.body;
  if (
    !name || typeof name !== 'string' ||
    typeof price !== 'number' || price < 0 ||
    typeof quantity !== 'number' || quantity < 0
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const result = await db.query(
      'INSERT INTO products (name, price, quantity) VALUES ($1, $2, $3) RETURNING *',
      [name, price, quantity]
    );
    const product = result.rows[0];
    // Async background logging (non-blocking)
    logProductAction('add', product);
    res.status(201).json(product);
  } catch (err) {
    if (err.code === '23505') {
      // Unique violation
      res.status(409).json({ error: 'Product with that name already exists' });
    } else if (err.code === '23514') {
      // Domain constraint violation
      res.status(400).json({ error: 'Invalid product price or quantity' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

// GET /products - Paginated list
app.get('/products', async (req, res) => {
  let { page = 1, per_page = 10 } = req.query;
  page = parseInt(page, 10);
  per_page = parseInt(per_page, 10);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(per_page) || per_page < 1) per_page = 10;

  try {
    const offset = (page - 1) * per_page;
    const query = 'SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2';
    const result = await db.query(query, [per_page, offset]);
    // Pagination info (optionally add total count)
    const countRes = await db.query('SELECT COUNT(*) FROM products');
    const total = parseInt(countRes.rows[0].count, 10);
    res.json({
      products: result.rows,
      page,
      per_page,
      total,
      total_pages: Math.ceil(total / per_page),
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /products/:id/quantity - Asynchronous quantity update, then log
app.put('/products/:id/quantity', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }
  try {
    const result = await db.query(
      'UPDATE products SET quantity=$1 WHERE id=$2 RETURNING *',
      [quantity, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const updated = result.rows[0];
    logProductAction('update', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /products/:id - Remove a product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM products WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted', id: parseInt(id, 10) });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Inventory API listening on port ${PORT}`);
});
