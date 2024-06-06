const express = require("express");
const { authenticate, restrict } = require("../middleware/verifyToken");
const { getCheckoutSession } = require("../controllers/bookingsController");

const router = express.Router();

router.post(
  "/checkout-session/:doctorId",
  authenticate,
  restrict(["patient"]),
  getCheckoutSession
);

module.exports = router;
