import catchAsync from "../utills/catchAsync.js";
import User from "../models/userModel.js";
import { createOne, getOne } from "./handleFactory.js";
import AppError from "../utills/appError.js";
function filterBody(body) {
    const allowedKeys = ["email", "fullName"];
    for (let key in body) {
        if (!allowedKeys.includes(key)) {
            delete body[key];
        }
    }
}
const createUser = createOne(User);
const getUser = getOne(User);
const getMe = catchAsync(async (req, res, next) => {
    req.params.id = req.user.id;
    next();
});
const updateUser = catchAsync(async (req, res, next) => {
    filterBody(req.body);
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedUser) {
        return next(new AppError("Update failed", 401));
    }
    updatedUser.password = undefined;
    res.status(200).json({
        message: "success",
        data: updatedUser,
    });
});
export { createUser, getMe, getUser, updateUser };
