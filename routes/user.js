const express = require("express");

const {
  adminAuth,
  patientAuth,
  authenticate,
  restrict,
} = require("../middleware/verifyToken");

const {
  updateUser,
  deleteUser,
  getSingleUser,
  getAllUsers,
  getUserProfile,
  getMyAppointments,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", authenticate, adminAuth, getAllUsers);
router.get("/:id", authenticate, patientAuth, getSingleUser);
router.put("/:id", authenticate, patientAuth, updateUser);
router.delete("/:id", authenticate, patientAuth, deleteUser);
router.get("/profile/me", authenticate, restrict(["patient"]), getUserProfile);
router.get(
  "/appointments/my-appointments",
  authenticate,
  restrict(["patient"]),
  getMyAppointments
);

module.exports = router;
