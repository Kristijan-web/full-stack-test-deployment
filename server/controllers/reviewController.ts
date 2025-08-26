import Review from "../models/ReviewModel.js";
import AppError from "../utills/appError.js";
import catchAsync from "../utills/catchAsync.js";
import { createOne } from "./handleFactory.js";

const createReview = createOne(Review);

const getTourReviews = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  console.log(tourId);
  const tourReview = await Review.find({ tour: tourId });
  if (tourReview.length === 0) {
    next(new AppError("Reviews for specified tour not found", 404));
  }
  res.status(200).json({
    message: "success",
    data: tourReview,
  });
});

export { createReview, getTourReviews };
