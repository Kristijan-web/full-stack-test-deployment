// ovde ce se raditi login,singup i autentifikacija

import User from "../models/userModel.js";
import AppError from "../utills/appError.js";
import catchAsync from "../utills/catchAsync.js";
import jwt from "jsonwebtoken";
import { deleteOne } from "./handleFactory.js";

const protect = catchAsync(async (req, res, next) => {
  // edge cases:
  // 1. Desifrovanje jwt-a i validacija
  // 2. Provera da li user i dalje postoji
  // 3. Provera vremena kada je sifra izmenjena sa vremenom kada je jwt napravljen (mozda je korisnik izmenio sifru pa da slucajno stari jwt ne ostane validan)
  // token mi se nalazi u http only kolacicu
  const jwtToken = req.cookies.jwt;
  console.log(jwtToken);
  // const jwtToken = await jwt.verify();
});

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  if (!newUser) {
    return next(new AppError("Failed to create new user", 400));
  }

  if (!process.env.JWT_SECRET_KEY || !process.env.JWT_EXPIRES) {
    console.log("Jwt secret token or expire time is not defined");
    return next(
      new AppError("Failed to create new user, error in service", 400)
    );
  }
  let jwtToken;
  try {
    jwtToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: +process.env.JWT_EXPIRES,
    });
  } catch (err) {
    req.body.id = newUser._id;
    deleteOne(User);
    return new AppError("Failed to create new user, error in service", 400);
  }

  const cookieOptions = {
    expires: new Date(
      Date.now() + +process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  res.cookie("jwt", jwtToken, cookieOptions);
});

export { protect, signup };
