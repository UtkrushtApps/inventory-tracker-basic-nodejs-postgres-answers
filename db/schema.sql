-- schema.sql: initial products table
drop table if exists products;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_name ON products(name);