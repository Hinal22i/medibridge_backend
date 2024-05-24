const express = require("express");

const { loginPatient, signupPatient } = require("../controllers/patient");

const app = express.Router();

app.route("/signup").post(signupPatient);
app.route("/login").post(loginPatient);

module.exports = app;
