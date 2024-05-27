const jwt = require("jsonwebtoken");
const Doctor = require("../schemas/Doctor");

const doctorAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Not Authorized." });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    req.doctor = await Doctor.findById(_id).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Not Authorized, go away" });
  }
};

module.exports = doctorAuth;
