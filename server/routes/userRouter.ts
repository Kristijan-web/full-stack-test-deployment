import express from "express";
import {
  changePassword,
  login,
  logout,
  protect,
  signup,
} from "../controllers/authController.js";
import { getMe, getUser, updateUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/me", protect, getMe, getUser);
userRouter.post("/change-password", protect, changePassword);

// userRouter.get("/:id", getUsers), userRouter.get("/:id", getUser);
// userRouter.post("/", createUser), userRouter.patch("/", updateUser);

userRouter.get("/:id", getUser);
userRouter.patch("/", protect, updateUser);
export default userRouter;
