const express = require("express");

const {
  updateUser,
  deleteUser,
  getSingleUser,
  getAllUsers,
  getUserProfile,
  getMyAppointments,
} = require("../controllers/userController");
const {
  authenticate,
  restrict,
  adminAuth,
  doctorAuth,
  patientAuth,
} = require("../middleware/verifyToken");

const router = express.Router();

router.get("/", authenticate, adminAuth, getAllUsers);
router.get("/:id", authenticate, patientAuth, getSingleUser);
router.put("/:id", authenticate, patientAuth, updateUser);
router.delete("/:id", authenticate, patientAuth, deleteUser);
router.get(
  "/profile/me",
  authenticate,
  restrict(["patient", "doctor", "admin"]),
  getUserProfile
);
router.get(
  "/appointments/my-appointments",
  authenticate,
  restrict(["patient"]),
  getMyAppointments
);

module.exports = router;
