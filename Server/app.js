const express = require("express");
const toursRouter = require("./routes/toursRouter");
const usersRouter = require("./routes/userRouter");
const app = express();

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/tours", toursRouter);
app.use("api/v1/users", usersRouter);

module.exports = app;
