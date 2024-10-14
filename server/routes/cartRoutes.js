const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // All cart routes should be protected

router.route("/").get(getCart).post(addToCart).delete(clearCart);

router.route("/:cart_item_id").put(updateCartItem).delete(removeFromCart);

module.exports = router;
