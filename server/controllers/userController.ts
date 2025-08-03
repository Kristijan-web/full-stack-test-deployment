import catchAsync from "../utills/catchAsync.js";
import AppError from "../utills/appError.js";
import User from "../models/userModel.js";
import { createOne, getOne } from "./handleFactory.js";

// wtf pa ne bi zvao funkciju ovde

const createUser = createOne(User);

const getUser = getOne(User);

const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

export { createUser, getMe, getUser };
