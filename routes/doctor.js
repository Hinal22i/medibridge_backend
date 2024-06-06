const express = require("express");

const {
  adminAuth,
  authenticate,
  doctorAuth,
  restrict,
} = require("../middleware/verifyToken");

const {
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  getSingleDoctor,
  getDoctorProfile,
} = require("../controllers/doctorController");

const review = require("./review");

const router = express.Router();

//nested route
router.use("/:doctorId/reviews", review);

router.get("/", getAllDoctors);
router.get("/:id", getSingleDoctor);
router.put("/:id", authenticate, doctorAuth, updateDoctor);
router.delete("/:id", authenticate, doctorAuth, deleteDoctor);
router.get("/profile/me", authenticate, restrict(["doctor"]), getDoctorProfile);

module.exports = router;
