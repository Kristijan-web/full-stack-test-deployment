const express = require("express");
const { signup } = require("../controllers/authController");

const usersRouter = express.Router();

usersRouter.post("/signup", signup);

module.exports = usersRouter;
