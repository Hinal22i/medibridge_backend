const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    validate: {
      validator: validator.isEmail,
      message: "Invalid Email",
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  files: {
    type: [String],
    default: [],
  },
});

doctorSchema.statics.signup = async function (
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
) {
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }

  if (
    !email ||
    !password ||
    !name ||
    !lastName ||
    !dateOfBirth ||
    !gender ||
    !registrationNumber ||
    !yearsOfExperience ||
    !specialization
  ) {
    throw Error("All fields must be filled in");
  }

  if (!validator.isEmail(email)) {
    throw Error("Invalid Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a symbol."
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const doctor = await this.create({
    name,
    lastName,
    dateOfBirth,
    email,
    password: hash,
    gender,
    registrationNumber,
    yearsOfExperience,
    specialization,
    files,
  });

  return doctor;
};

doctorSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled in");
  }

  const doctor = await this.findOne({ email });

  if (!doctor) {
    throw Error("Doctor does not exist or incorrect password");
  }

  const match = await bcrypt.compare(password, doctor.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return doctor;
};

module.exports = mongoose.model("Doctor", doctorSchema);
