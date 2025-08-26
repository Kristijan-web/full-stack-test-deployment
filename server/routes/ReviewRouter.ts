import express from "express";
import {
  createReview,
  getTourReviews,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", createReview);

// Mora da zabranim da user moze da ostavi vise review-a na jednom tour-u

// reviews za odredjeni tour
reviewRouter.get("/:tourId", getTourReviews);

export default reviewRouter;
