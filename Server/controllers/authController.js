// Trebace protect funkcija za autorizaciju
// trebace signup i login funkcije za autentifikaciju
// trebace funckcija za pravljenje JWT-a
const jwt = require("jsonwebtoken");
const catchAsync = require("../utills/catchAsync");
const User = require("../models/userModel");

const signup = catchAsync(async function (req, res, next) {
  // kad napravim novog usera vrati jwt
  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  // napravi jwt i posalji usera
  const jwtToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  res.status(200).json({
    message: "success",
    data: {
      jwtToken,
    },
  });
});

module.exports = { signup };
