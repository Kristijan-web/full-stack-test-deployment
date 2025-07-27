import express from "express";

const userRouter = express.Router();

userRouter.get("/api/v1/users", getUsers),
  userRouter.get("/api/v1/users/:id", getUser);
userRouter.post("/api/v1/users", createUser),
  userRouter.patch("/api/v1/users", updateUser);

export default userRouter;
