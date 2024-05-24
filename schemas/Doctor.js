const mongoose = require("mongoose");

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
    unique: true,
    match: [],
  },
  password: {
    type: String,
    required: true,
  },

  profilePicture: {
    type: String,
  },
  address: {
    type: String,
  },
  files: {
    type: [String],
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
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
  reviews: [
    {
      patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
      feedback: {
        type: String,
      },
    },
  ],
});

doctorSchema.statics.signup = async function (email, password) {
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

  const doctor = await this.create({ email, password: hash });

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
