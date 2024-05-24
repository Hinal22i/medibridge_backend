const Doctor = require("../schemas/Doctor");
const jwt = require("jsonwebtoken");

const createToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.SECRET, { expiresIn: "1d" });
};

const loginDoctor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const doctor = await Doctor.login(email, password);

    const token = createToken(doctor._id, doctor.email);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupDoctor = async (req, res) => {
  const {
    name,
    lastName,
    dateOfBirth,
    email,
    password,
    gender,
    registrationNumber,
    yearsOfExperience,
    specialization,
    files,
  } = req.body;
  try {
    const doctor = await Doctor.signup(
      name,
      lastName,
      dateOfBirth,
      email,
      password,
      gender,
      registrationNumber,
      yearsOfExperience,
      specialization,
      files
    );

    const token = createToken(doctor._id, doctor.email);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginDoctor, signupDoctor };
