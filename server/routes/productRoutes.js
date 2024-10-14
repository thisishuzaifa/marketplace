const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
} = require("../controllers/productController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", protect, restrictTo("store_owner"), createProduct);

module.exports = router;
