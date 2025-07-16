const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  tourName: {
    type: String,
    required: [true, "Tour name is required"],
  },
  tourPrice: {
    type: Number,
    required: [true, "Price is required"],
    validate: {
      validator: (value) => {
        return value > 0;
      },
      message: "Price must be above 0",
    },
  },
  tours: [String],
  tourGuide: {
    type: String,
    required: [true, "Tour guide is required"],
  },
});

const Tour = mongoose.model("tours", tourSchema);

module.exports = Tour;
