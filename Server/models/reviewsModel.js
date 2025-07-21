const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "review message is required"],
  },
  rating: {
    type: Number,
    required: [true, "rating is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "tours",
    required: [true, "Tour is required for review"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
    required: [true, "User is required for review"],
  },
});

const Review = mongoose.model("Reviews", reviewSchema);

module.exports = Review;
