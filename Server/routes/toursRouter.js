const express = require("express");
const {
  getTours,
  createTour,
  updateTour,
  getTour,
} = require("../controllers/tourController");
const toursRouter = express.Router();

toursRouter.get("/", getTours);
toursRouter.get("/:id", getTour);
toursRouter.post("/", createTour);
toursRouter.patch("/:id", updateTour);

module.exports = toursRouter;
