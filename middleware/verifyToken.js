const jwt = require("jsonwebtoken");
const Doctor = require("../schemas/Doctor");
const User = require("../schemas/User");

const authenticate = async (req, res, next) => {
  const authToken = req.headers.authorization;

  //if token exist
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }
  try {
    const token = authToken.split("")[1];

    const decoded = jwt.verify(token, process.env.SECRET);

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

  const patient = await User.findById(userId);
  const doctor = await Doctor.findById(userId);

  if (patient) {
    user = patient;
  } else if (doctor) {
    user = doctor;
  } else {
    return res.status(404).json({ message: "User not found" });
  }

  if (!roles.includes(user.role)) {
    return res
      .status(401)
      .json({ success: false, message: "You're not authorized" });
  }

  next();
};

const adminAuth = restrict(["admin"]);

const doctorAuth = restrict(["doctor"]);

const patientAuth = restrict(["patient", "admin"]);

module.exports = { authenticate, restrict, adminAuth, doctorAuth, patientAuth };
