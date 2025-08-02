import express from "express";
import { createTour, filterTourBody, getTour, getTours, updateTour, } from "../controllers/tourController.js";
import { protect } from "../controllers/authController.js";
const tourRouter = express.Router();
tourRouter.get("/", protect, getTours);
tourRouter.get("/:id", getTour);
tourRouter.post("/", filterTourBody, createTour);
tourRouter.patch("/:id", updateTour);
export default tourRouter;
