const Patient = require("../schemas/Patient");
const jwt = require("jsonwebtoken");

const createToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.SECRET, { expiresIn: "1d" });
};

const loginPatient = async (req, res) => {
  const { email, password } = req.body;
  try {
    const patient = await Patient.login(email, password);

    const token = createToken(patient._id, patient.email);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupPatient = async (req, res) => {
  const { name, lastName, dateOfBirth, email, password, gender } = req.body;
  try {
    const patient = await Patient.signup(
      name,
      lastName,
      dateOfBirth,
      email,
      password,
      gender
    );

    const token = createToken(patient._id, patient.email);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginPatient, signupPatient };
