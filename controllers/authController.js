const User = require("../schemas/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../schemas/Doctor.js");

// generate token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.SECRET, {
    expiresIn: "15d",
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, role, photo, gender } = req.body;
  console.log("REGISTERING THE USER");
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = await User.create({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    } else if (role === "doctor") {
      user = await Doctor.create({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    console.log("USER TO BE SAVED:", user);

    console.log("ARE WE GETTING HERE?");
    res
      .status(200)
      .json({ success: true, message: "User successfully created" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Internal server error! Try again" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user =
      (await User.findOne({ email })) || (await Doctor.findOne({ email }));
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const { password: _, ...rest } = user._doc;

    // Get token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      token,
      data: { ...rest },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to login" });
  }
};

module.exports = { registerUser, login };
