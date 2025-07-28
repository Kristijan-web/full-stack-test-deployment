import mongoose, { InferSchemaType } from "mongoose";

const tourSchema = new mongoose.Schema({
  tourName: {
    type: String,
    required: [true, "Tour name is required"],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  guides: {
    type: [String],
    required: [true, "Guides are required"],
    validate: {
      validator: function (arr: string[]) {
        return arr.length > 0;
      },
      message: "There must be at least one guide",
    },
  },
  leadGuide: {
    type: String,
    required: [true, "Lead guide is required"],
  },
  tours: {
    type: [String],
    required: [true, "Tours are required"],
    validate: {
      validator: function (arr: string[]) {
        return arr.length > 0;
      },
      message: "There must be at least one tour in the list",
    },
  },
  tourCover: {
    type: String,
  },
});

type TourType = InferSchemaType<typeof tourSchema>;

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
export { TourType };
