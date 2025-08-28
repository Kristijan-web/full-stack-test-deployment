import mongoose from "mongoose";
const tourSchema = new mongoose.Schema({
    tourName: {
        type: String,
        required: [true, "Tour name is required"],
        trim: true,
    },
    tourPrice: {
        type: Number,
        required: [true, "Tour price is required"],
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
            validator: function (arr) {
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
            validator: function (arr) {
                return arr.length > 0;
            },
            message: "There must be at least one tour in the list",
        },
    },
    tourCover: {
        type: String,
    },
    locations: [
        {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
    ],
    tourGuides: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Tour must have a guide"],
        },
    ],
    isActive: {
        type: Boolean,
        default: false,
    },
});
// tourSchema.index({ locations: "2dsphere" });
// za embedding po id-u
// tourSchema.pre("save", async function (next) {
//   const tourGuides = await Promise.all(
//     this.tourGuides.map(async (id) => {
//       return await User.findById(id);
//     })
//   );
//   this.tourGuides = tourGuides;
//   next();
// });
// za populate koristi pre-query middleware
tourSchema.pre("find", function (next) {
    // ty
    this.populate({ path: "tourGuides" });
    next();
});
const Tour = mongoose.model("Tour", tourSchema);
export default Tour;
