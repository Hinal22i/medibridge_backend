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
    type: Number,
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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bloodType: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  address: {
    type: String,
  },
  pictures: {
    type: [String],
  },
  medicalRecord: {
    type: String,
  },

  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

patientSchema.statics.signup = async function (email, password) {
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }

  if (!email || !password) {
    throw Error("All fields must be filled in");
  }

  if (!validator.isEmail(email)) {
    throw Error("Invalid Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Make sure to use at least 8 characters, 1 uppercase, 1 lowercase and a symbol."
    );
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  const patient = await this.create({ email, password: hash });

  return patient;
};

patientSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled in");
  }

  const patient = await this.findOne({ email });

  if (!patient) {
    throw Error("Patient does not exit or incorrect password");
  }

  const match = await bcrypt.compare(password, patient.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return patient;
};

module.exports = mongoose.model("Patient", patientSchema);
