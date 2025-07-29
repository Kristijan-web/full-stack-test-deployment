import express from "express";
import {
  createTour,
  filterTourBody,
  getTour,
  getTours,
  updateTour,
} from "../controllers/tourController.js";

const tourRouter = express.Router();

tourRouter.get("/", getTours);
tourRouter.get("/:id", getTour);
tourRouter.post("/", filterTourBody, createTour);
tourRouter.patch("/:id", updateTour);

export default tourRouter;
