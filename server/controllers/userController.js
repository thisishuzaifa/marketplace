// controllers/userController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const asyncHandler = require("../utils/asyncHandler");

// Register a new user
exports.registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, is_store_owner } = req.body;

  // Check if user already exists
  const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (userExists.rows.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const result = await db.query(
    "INSERT INTO users (username, email, password_hash, is_store_owner) VALUES ($1, $2, $3, $4) RETURNING *",
    [username, email, hashedPassword, is_store_owner],
  );

  const user = result.rows[0];

  res.status(201).json({
    id: user.user_id,
    username: user.username,
    email: user.email,
    is_store_owner: user.is_store_owner,
    token: generateToken(user.user_id),
  });
});

// Login user
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = result.rows[0];

  if (user && (await bcrypt.compare(password, user.password_hash))) {
    res.json({
      id: user.user_id,
      username: user.username,
      email: user.email,
      is_store_owner: user.is_store_owner,
      token: generateToken(user.user_id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// Get user profile
exports.getUserProfile = asyncHandler(async (req, res) => {
  const result = await db.query(
    "SELECT user_id, username, email, is_store_owner FROM users WHERE user_id = $1",
    [req.user.user_id],
  );
  const user = result.rows[0];

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Update user profile
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const result = await db.query("SELECT * FROM users WHERE user_id = $1", [
    req.user.user_id,
  ]);
  const user = result.rows[0];

  if (user) {
    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await db.query(
      "UPDATE users SET username = $1, email = $2, password_hash = $3 WHERE user_id = $4 RETURNING user_id, username, email, is_store_owner",
      [user.username, user.email, user.password_hash, req.user.user_id],
    );

    res.json({
      id: updatedUser.rows[0].user_id,
      username: updatedUser.rows[0].username,
      email: updatedUser.rows[0].email,
      is_store_owner: updatedUser.rows[0].is_store_owner,
      token: generateToken(updatedUser.rows[0].user_id),
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
