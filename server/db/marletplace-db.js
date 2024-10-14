const pg = require("pg");
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const seedDatabase = async () => {
  try {
    await pool.query(
      `INSERT INTO products (store_owner_id, category_id, name, description, price, stock_quantity, image_url) VALUES (1, 1, 'Product 1', 'This is a product description', 10.99, 10, 'https://example.com/product-1.jpg')`,
    );
    await pool.query(
      `INSERT INTO products (store_owner_id, category_id, name, description, price, stock_quantity, image_url) VALUES (1, 2, 'Product 2', 'This is another product description', 19.99, 10, 'https://example.com/product-2.jpg')`,
    );
    await pool.query(
      `INSERT INTO products (store_owner_id, category_id, name, description, price, stock_quantity, image_url) VALUES (1, 3, 'Product 3', 'This is a third product description', 5.99, 10, 'https://example.com/product-3.jpg')`,
    );
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

module.exports = {
  seedDatabase,
};
