const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  getReviewById,
  createReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAllReviews);
router.get("/:id", protect, getReviewById);
router.post("/", protect, createReview);

module.exports = router;
