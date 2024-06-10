const express = require("express");
const { authenticate, patientAuth } = require("../middleware/verifyToken");

const {
  getAllReviews,
  createReview,
} = require("../controllers/reviewController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(authenticate, patientAuth, createReview);

module.exports = router;
