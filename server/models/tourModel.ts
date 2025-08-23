import mongoose, { InferSchemaType } from "mongoose";
import User from "./userModel.js";
// Uradi embedding sa tour-guide-ovima pa zatim child referencing

// Users je parent kolekcija a tours je child

// kako bi izgledao parent referencing

// Ko je parent? Users
// Ko je child? Tours

// Kada se napravi novi user on drzi referencu ka tour-u, ovo je uzasno jer nisu svi useri tour guide-ovi

// Kako bi izgledao child referencing?

// Svaki put kada se napravi novi tour, document ce u sebi imati polje tourGuides koji ce biti niz referenci ka user-ima koji su tour guide-ovi

// CHILD REFERENCING WINS

// Zasto je uzed referencing umesto embedding

// Nema cestih read operacija niti cestih update operacija tako da posto je mala aplikacija sve mi jedno da li ce biti embedding/referencing, meedjutim ako bih uzeo
// embedding onda bih morao da svaki put kada tour-guide promeni svoje podatke morao bih da ih promenim u kolekciji users i onda u kolekciji tours i to na vise mesta ako pripadaju vise tour-ova

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
});
type TourType = InferSchemaType<typeof tourSchema>;

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
export { TourType };
