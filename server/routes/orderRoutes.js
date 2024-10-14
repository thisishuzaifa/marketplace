const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAllOrders);
router.get("/:id", protect, getOrderById);
router.post("/", protect, createOrder);

module.exports = router;
