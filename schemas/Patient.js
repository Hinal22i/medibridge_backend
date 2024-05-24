const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const patientSchema = new mongoose.Schema({
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
  bloodType: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  pictures: {
    type: [String],
    default: [],
  },
  medicalRecord: {
    type: String,
    default: "",
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

patientSchema.statics.signup = async function (
  name,
  lastName,
  dateOfBirth,
  email,
  password,
  gender
) {
  console.log("Received email:", email); // Debug log

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }

  if (!email || !password || !name || !lastName || !dateOfBirth || !gender) {
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

  const patient = await this.create({
    name,
    lastName,
    dateOfBirth,
    email,
    password: hash,
    gender,
  });

  return patient;
};

module.exports = mongoose.model("Patient", patientSchema);
