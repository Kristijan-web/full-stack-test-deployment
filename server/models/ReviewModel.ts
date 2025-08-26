import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, `Review must contain description`],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    validate: {
      validator: (value: number) => {
        return value <= 5 && value >= 1;
      },
      message: "rating must be from 1-5",
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
  },
});

reviewsSchema.index({ tour: 1, user: 1 }, { unique: true });
const Review = mongoose.model("Review", reviewsSchema);

export default Review;
