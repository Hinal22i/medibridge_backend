const express = require("express");
const cors = require("cors");
require("colors");
require("dotenv").config();
const app = express();
const connectDB = require("./dbinit");
const auth = require("./routes/auth");
const user = require("./routes/user");
const doctor = require("./routes/doctor");
const review = require("./routes/review");
const cookieParser = require("cookie-parser");
const booking = require("./routes/bookings");
const corsOptions = {
  origin: true, // For production, replace `true` with an array of allowed origins
};

//middlewares
app.use(express.json());
app.use(cookieParser()); // Invoke the cookieParser
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB()
  .then(() => {
    console.log("Database connected successfully".green);
  })
  .catch((error) => {
    console.error("Database connection failed".red, error);
    process.exit(1); // Exit the process with failure code
  });

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.use("/api/auth", auth);
app.use("/api/users", user);
app.use("/api/doctors", doctor);
app.use("/api/reviews", review);
app.use("/api/bookings", booking);

app.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`.rainbow);
});
