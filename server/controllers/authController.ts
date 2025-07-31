// ovde ce se raditi login,singup i autentifikacija

import User from "../models/userModel.js";
import AppError from "../utills/appError.js";
import catchAsync from "../utills/catchAsync.js";
import jwt from "jsonwebtoken";
import { deleteOne } from "./handleFactory.js";

const signup = catchAsync(async (req, res, next) => {
  // Koraci
  // 1. Korisnik salje email password i confirmPassword
  // 2. Password se hash-uje
  // 3. confirmPassword je u schema ali nije u bazi (koristi pre document middleware iz mongoose-a)
  // 4. Ako je pravljenje korisnika u bazi uspesno, onda napravi jwt token i posalji korisniku
  // 4.1 Ako pravljenje jwt tokena fail-uje onda obrisi korisnika iz baze

  console.log("Evo body-a,", req.body);

  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  if (!newUser) {
    return next(new AppError("Failed to create new user", 400));
  }

  // postoje 3 parametra koja moramo da navedemo kada pravimo jwt token
  // 1. body jwt-a
  // 2. jwt_secret_key
  // 3. jwt expire duration
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
  res.status(200).json({
    message: "success",
    data: {
      jwtToken,
    },
  });
});

export default signup;
