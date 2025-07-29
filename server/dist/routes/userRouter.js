import express from "express";
import signup from "../controllers/authController.js";
const userRouter = express.Router();
userRouter.post("/signup", signup);
// userRouter.get("/:id", getUsers), userRouter.get("/:id", getUser);
// userRouter.post("/", createUser), userRouter.patch("/", updateUser);
export default userRouter;
