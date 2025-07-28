import express from "express";
import { createTour, filterTourBody, getTour, getTours, updateTour, } from "../controllers/tourControlle.js";
const tourRouter = express.Router();
console.log("OLAAAA");
tourRouter.get("/", getTours);
tourRouter.get("/:id", getTour);
tourRouter.post("/", filterTourBody, createTour);
tourRouter.patch("/:id", updateTour);
export default tourRouter;
