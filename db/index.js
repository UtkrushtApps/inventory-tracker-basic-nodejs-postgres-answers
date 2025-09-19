// db/index.js: Connects to PostgreSQL using 'pg'
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'inventory',
  password: process.env.PGPASSWORD || 'postgres',
  port: parseInt(process.env.PGPORT, 10) || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
