const db = require("../config/database");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllProducts = asyncHandler(async (req, res) => {
  const result = await db.query("SELECT * FROM products");
  res.json(result.rows);
});

exports.getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await db.query(
    "SELECT * FROM products WHERE product_id = $1",
    [id],
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(result.rows[0]);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const {
    store_owner_id,
    category_id,
    name,
    description,
    price,
    stock_quantity,
    image_url,
  } = req.body;
  const result = await db.query(
    "INSERT INTO products (store_owner_id, category_id, name, description, price, stock_quantity, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [
      store_owner_id,
      category_id,
      name,
      description,
      price,
      stock_quantity,
      image_url,
    ],
  );
  res.status(201).json(result.rows[0]);
});
