const express = require("express");

const { loginDoctor, signupDoctor } = require("../controllers/doctor");

const app = express.Router();

app.route("/signup").post(signupDoctor);
app.route("/login").post(loginDoctor);

module.exports = app;
