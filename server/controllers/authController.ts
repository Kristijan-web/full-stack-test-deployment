// ovde ce se raditi login,singup i autentifikacija

import User, { UserType } from "../models/userModel.js";
import AppError from "../utills/appError.js";
import catchAsync from "../utills/catchAsync.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { deleteOne } from "./handleFactory.js";
import { NextFunction, Request, Response } from "express";
import { HydratedDocument } from "mongoose";
import sendMail from "../utills/sendMail.js";
import crypto from "crypto";
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
  // edge cases:
  // 1. Desifrovanje jwt-a i validacija
  // 2. Provera da li user i dalje postoji
  // 3. Provera vremena kada je sifra izmenjena sa vremenom kada je jwt napravljen (mozda je korisnik izmenio sifru pa da slucajno stari jwt ne ostane validan)
  // token mi se nalazi u http only kolacicu
  console.log(req.cookies);
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
    fullName: req.body.fullName,
    confirmPassword: req.body.confirmPassword,
  });

  if (!newUser) {
    return next(new AppError("Failed to create new user", 400));
  }
  editCookieJWT(req, res, next, newUser);

  newUser.password = undefined as any;

  res.status(200).json({
    message: "success",
    data: newUser,
  });
});

const login = catchAsync(async (req, res, next) => {
  // User se nalazi na osnovu mail-a u bazi i zatim se porede hashovane sifre
  const { email, password } = req.body;
  const currentUser = await User.findOne({ email });
  if (!currentUser) {
    return next(new AppError("Email does not exist", 401));
  }

  const isPasswordCorrect = await currentUser.correctPassword(
    password,
    currentUser.password
  );
  if (!isPasswordCorrect) {
    return next(new AppError("Password is not correct", 401));
  }

  // mora jwt da mu ubacim
  editCookieJWT(req, res, next, currentUser);

  res.status(200).send();
});

const logout = catchAsync(async (req, res, next) => {
  const cookieOptions = {
    httpOnly: true,
    sameSite: "none" as "none",
    secure: true,
  };

  res.clearCookie("jwt", cookieOptions);

  res.status(200).send();
});

const changePassword = catchAsync(async (req, res, next) => {
  // mora da se upise vreme kada je promenjena sifra
  // da li da koristim findByIdAndUpdate ili da dohvatim usera, rucno izmenim sifru i uradim save()
  // po kursu on koristi #2 metodu. Zasto je ona bolja?
  // Bolje je zato sto trigeruje pre-save-document-middleware
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const doesPasswordMatch = user?.correctPassword(
    req.body.oldPassword,
    user.password
  );
  if (!doesPasswordMatch) {
    return next(new AppError("Old password is not correct", 401));
  }
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmNewPassword;
  await user.save(); // ovo ce pokrenuti schema validaciju
  // izmeni passwordChangedAt to jest napravi pre-save-document-middleware CHECKED
  // posalji novi jwt korisniku
  editCookieJWT(req, res, next, user);
  res.status(200).send();
});

const passwordResetToken = catchAsync(async (req, res, next) => {
  // na osnovu mail-a nalazim user-a
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("Email is incorrect", 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const reset_link = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const options = {
    from: `Kristijan krimster8@gmail.com`,
    to: user.email,
    subject: "Your reset token, valid for next 10 minutes",
    text: `Reset token: ${reset_link}`,
  };
  await sendMail(options);
  res.status(204).send();
});

const forgotPassword = catchAsync(async (req, res, next) => {
  //  - Get user based on the token

  // - Check if token has not expired and there is user, set the new password

  // - Update changedPasswordAt property for the user

  // - Log the user in, send JWT

  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  // mora da se hashuje token i na osnovu hash-ovanog tokena dohvati user

  const tokenHashed = crypto.createHash("sha256").update(token).digest("hex");

  // nadji usera po tokeni i  da je expiresToken manje od Date.now()
  const user = await User.findOne({
    passwordResetToken: tokenHashed,
    passwordResetExpires: {
      $gt: new Date(Date.now()),
    },
  });
  if (!user) {
    return next(
      new AppError("User has been removed or token has expired", 400)
    );
  }

  // set new Password, and change passwordChangedAt
  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();
  editCookieJWT(req, res, next, user);
  res.status(200).send();
});

export {
  protect,
  signup,
  login,
  logout,
  changePassword,
  passwordResetToken,
  forgotPassword,
};
