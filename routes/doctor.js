const express = require("express");

const {
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  getSingleDoctor,
} = require("../controllers/doctorController");
const { authenticate, restrict } = require("../middleware/verifyToken");

const review = require("./review");

const router = express.Router();

//nested route
router.use("/:doctorId/reviews", review);

router.get("/:id", getSingleDoctor);
router.get("/", getAllDoctors);
router.put("/:id", authenticate, restrict(["doctor"]), updateDoctor);
router.delete("/:id", authenticate, restrict(["doctor"]), deleteDoctor);

module.exports = router;
