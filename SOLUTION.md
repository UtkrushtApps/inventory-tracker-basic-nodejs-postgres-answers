# Solution Steps

1. 1. Design and write the PostgreSQL database schema for a 'products' table with columns: id, name, price, quantity, created_at, appropriate types, constraints, and indexes (see db/schema.sql).

2. 2. In db/index.js, set up a connection pool to PostgreSQL using the 'pg' library and export methods for querying the database.

3. 3. Create a logger.js module that exposes an async, non-blocking function to append log entries of product add/update actions to a log file. Use fs.promises.appendFile and ensure logging errors do not crash the app.

4. 4. Set up app.js as the entry-point Express app. Import the db and logger modules. Use express.json middleware to handle JSON bodies.

5. 5. Implement POST /products to add new products to the database via SQL. Handle errors (e.g., duplicate name, constraint violations), and after successful transaction, call logger.logProductAction asynchronously (do not wait for it). Respond with the created product as JSON.

6. 6. Implement GET /products for paginated access: accept page/per_page parameters, perform SQL with limit/offset, and provide pagination data (total count, page, etc.). Respond with an array of products and meta info.

7. 7. Implement PUT /products/:id/quantity to update a product's quantity, validate input, return errors/not found as appropriate, and call the logger in the background after updating.

8. 8. Implement DELETE /products/:id to delete a product by id, returning not found if id is absent, and success message otherwise. (No logging required here.)

9. 9. Ensure all async database and logging operations are properly handled with await/then and try/catch for robust error handling. Use appropriate HTTP status codes.

10. 10. Start the Express app on a configurable port and test all endpoints with a real Postgres database.

