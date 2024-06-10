const jwt = require("jsonwebtoken");
const Doctor = require("../schemas/Doctor");
const User = require("../schemas/User");

const authenticate = async (req, res, next) => {
  const authToken = req.headers.authorization;

  // Check if token exists
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    const token = authToken.split(" ")[1]; // Fix: Correct token extraction

    const decoded = jwt.verify(token, process.env.SECRET); // Ensure the secret key is correct

    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    }

    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;

  let user;

  try {
    const patient = await User.findById(userId);
    const doctor = await Doctor.findById(userId);

    if (patient) {
      user = patient;
    } else if (doctor) {
      user = doctor;
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!roles.includes(user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "You're not authorized" }); // 403 for forbidden
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const adminAuth = restrict(["admin"]);
const doctorAuth = restrict(["doctor"]);
const patientAuth = restrict(["patient", "admin"]);

module.exports = { authenticate, restrict, adminAuth, doctorAuth, patientAuth };
