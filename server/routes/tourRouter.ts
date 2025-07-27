import express from "express";
import {
  createTour,
  getTour,
  getTours,
  updateTour,
} from "../controllers/tourControlle.js";

const tourRouter = express.Router();

tourRouter.get("/api/v1/tours", getTours);
tourRouter.get("/api/v1/tours/:id", getTour);
tourRouter.post("/api/v1/tours", createTour);
tourRouter.patch("/api/v1/tours/:id", updateTour);

export default tourRouter;
