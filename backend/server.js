const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/authRoute')
const otpRoute = require('./routes/otpRoute')
const errorHandler = require('./middleWare/errorMiddleware')
const cors = require("cors");

const app = express();

app.use(cookieParser())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://InvTrack-app.vercel.app"],
    credentials: true,
  })
);

app.use('/api/auth', authRoute)
app.use('/api/otp', otpRoute)

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
