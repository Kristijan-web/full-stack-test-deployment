const express = require("express");
const toursRouter = require("./routes/toursRouter");

const app = express();

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/tours", toursRouter);

module.exports = app;
