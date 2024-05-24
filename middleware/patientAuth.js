const jwt = require("jsonwebtoken");
const Patient = require("../schemas/Patient");

const patientAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Not Authorized." });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    req.patient = await Patient.findById(_id).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Not Authorized, go away" });
  }
};

module.exports = patientAuth;
