// controllers/cartController.js

const db = require("../config/database");
const asyncHandler = require("../utils/asyncHandler");

// Get cart contents
exports.getCart = asyncHandler(async (req, res) => {
  const result = await db.query(
    `
    SELECT ci.cart_item_id, ci.product_id, ci.quantity, p.name, p.price, p.image_url
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.product_id
    JOIN carts c ON ci.cart_id = c.cart_id
    WHERE c.user_id = $1
  `,
    [req.user.user_id],
  );

  res.json(result.rows);
});

// Add item to cart
exports.addToCart = asyncHandler(async (req, res) => {
  const { product_id, quantity } = req.body;

  // Check if the product exists and is in stock
  const productResult = await db.query(
    "SELECT * FROM products WHERE product_id = $1",
    [product_id],
  );
  if (productResult.rows.length === 0) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (productResult.rows[0].stock_quantity < quantity) {
    return res.status(400).json({ message: "Not enough stock" });
  }

  // Get or create cart for the user
  let cartResult = await db.query("SELECT * FROM carts WHERE user_id = $1", [
    req.user.user_id,
  ]);
  if (cartResult.rows.length === 0) {
    cartResult = await db.query(
      "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
      [req.user.user_id],
    );
  }
  const cart_id = cartResult.rows[0].cart_id;

  // Check if the item is already in the cart
  const cartItemResult = await db.query(
    "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
    [cart_id, product_id],
  );

  if (cartItemResult.rows.length > 0) {
    // Update quantity if item exists
    const newQuantity = cartItemResult.rows[0].quantity + quantity;
    await db.query(
      "UPDATE cart_items SET quantity = $1 WHERE cart_item_id = $2",
      [newQuantity, cartItemResult.rows[0].cart_item_id],
    );
  } else {
    // Add new item to cart
    await db.query(
      "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)",
      [cart_id, product_id, quantity],
    );
  }

  res.status(201).json({ message: "Item added to cart" });
});

// Update cart item quantity
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { cart_item_id } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  const result = await db.query(
    `
    UPDATE cart_items
    SET quantity = $1
    WHERE cart_item_id = $2
    AND cart_id IN (SELECT cart_id FROM carts WHERE user_id = $3)
    RETURNING *
  `,
    [quantity, cart_item_id, req.user.user_id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  res.json(result.rows[0]);
});

// Remove item from cart
exports.removeFromCart = asyncHandler(async (req, res) => {
  const { cart_item_id } = req.params;

  const result = await db.query(
    `
    DELETE FROM cart_items
    WHERE cart_item_id = $1
    AND cart_id IN (SELECT cart_id FROM carts WHERE user_id = $2)
    RETURNING *
  `,
    [cart_item_id, req.user.user_id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  res.json({ message: "Item removed from cart" });
});

// Clear cart
exports.clearCart = asyncHandler(async (req, res) => {
  await db.query(
    `
    DELETE FROM cart_items
    WHERE cart_id IN (SELECT cart_id FROM carts WHERE user_id = $1)
  `,
    [req.user.user_id],
  );

  res.json({ message: "Cart cleared" });
});
