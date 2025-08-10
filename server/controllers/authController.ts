// ovde ce se raditi login,singup i autentifikacija

import User, { UserType } from "../models/userModel.js";
import AppError from "../utills/appError.js";
import catchAsync from "../utills/catchAsync.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { deleteOne } from "./handleFactory.js";
import { NextFunction, Request, Response } from "express";
import { HydratedDocument } from "mongoose";

function editCookieJWT(
  req: Request,
  res: Response,
  next: NextFunction,
  currentUser: HydratedDocument<UserType>
) {
  if (!process.env.JWT_SECRET_KEY || !process.env.JWT_EXPIRES) {
    console.log("Jwt secret token or expire time is not defined");
    return next(
      new AppError("Failed to create new user, error in service", 400)
    );
  }

  let jwtToken;

  try {
    jwtToken = jwt.sign({ id: currentUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: +process.env.JWT_EXPIRES,
    });
  } catch (err) {
    req.body.id = currentUser._id;
    deleteOne(User);
    return next(
      new AppError("Failed to create new user, error in service", 400)
    );
  }
  // secure: process.env.NODE_ENV === "production",

  const cookieOptions = {
    expires: new Date(
      Date.now() + +process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000
    ),
    sameSite: "none" as "none",
    secure: true,
    httpOnly: true,
  };
  res.cookie("jwt", jwtToken, cookieOptions);
}
const protect = catchAsync(async (req, res, next) => {
  // MORA PROTECT DA NAPRAVIM
  // edge cases:
  // 1. Desifrovanje jwt-a i validacija
  // 2. Provera da li user i dalje postoji
  // 3. Provera vremena kada je sifra izmenjena sa vremenom kada je jwt napravljen (mozda je korisnik izmenio sifru pa da slucajno stari jwt ne ostane validan)
  // token mi se nalazi u http only kolacicu
  const jwtFromCookie = req.cookies?.jwt;
  if (!jwtFromCookie) {
    console.log("EEEJ");
    return next(new AppError("Not authenticated", 401));
  }

  if (!process.env.JWT_SECRET_KEY) {
    console.log("JWT SECRET KEY IS NOT DEFINED!!!");
    process.exit();
  }
  // 1. Desifrovanje jwt-a i validacija
  const jwtDecoded = jwt.verify(
    jwtFromCookie,
    process.env.JWT_SECRET_KEY
  ) as JwtPayload & { id: string; iat: number; exp: number };

  console.log("EVO DECODED JWT-a", jwtDecoded);
  if (!jwtDecoded) {
    return;
  }
  // 2. Provera da li user postoji
  const currentUser = await User.findById(jwtDecoded.id);

  if (!currentUser) {
    return next(new AppError("User has been removed", 404));
  }
  // 3. Provera da li je sifra izmenjena

  const isPasswordInJwtOld = currentUser.didPasswordChange(jwtDecoded.iat);
  if (isPasswordInJwtOld) {
    return next(new AppError("You're using old pasword!", 401));
  }

  req.user = currentUser;
  next();
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
  editCookieJWT(req, res, next, newUser);
  res.status(200).json({
    message: "success",
  });
});

const login = catchAsync(async (req, res, next) => {
  // Kako se radi login?
  // User se nalazi na osnovu mail-a u bazi i zatim se porede hashovane sifre
  const { email, password } = req.body;
  const currentUser = await User.findOne({ email });
  if (!currentUser) {
    return next(new AppError("Email is incorrect", 401));
  }

  const isPasswordCorrect = await currentUser.correctPassword(
    password,
    currentUser.password
  );
  if (!isPasswordCorrect) {
    return next(new AppError("Passwords do not match", 401));
  }

  // mora jwt da mu ubacim
  editCookieJWT(req, res, next, currentUser);

  res.status(200).send();
});

export { protect, signup, login };
