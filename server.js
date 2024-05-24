const express = require("express");
const cors = require("cors");
require("colors");
require("dotenv").config();
const app = express();
const connectDB = require("./dbinit");

//middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

connectDB();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`.rainbow);
});
