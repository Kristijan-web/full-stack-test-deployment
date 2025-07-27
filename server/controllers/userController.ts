import catchAsync from "../utills/catchAsync.js";
import AppError from "../utills/appError.js";
import User from "../models/userModel.js";
import { createOne } from "./handleFactory.js";

// wtf pa ne bi zvao funkciju ovde

const createUser = createOne(User);

export { createUser };
