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
  tourGuides: Array,
});
type TourType = InferSchemaType<typeof tourSchema>;

// tourSchema.index({ locations: "2dsphere" });

tourSchema.pre("save", async function (next) {
  // dohvati sve tour Guide-ove
  // this pokazuje na document jer je u pitanju pre-document middleware
  // dobicu niz Promise-a
  const tourGuides = await Promise.all(
    this.tourGuides.map(async (id) => {
      return await User.findById(id);
    })
  );
  // NE ZNAM SINTAKSU KADA TREBA DA RADIM EMBEDDING PREKO ID-A

  // Kada bih radio embedding direktno u document-u a kada preko id-a
  // Radio bi direktan embedding kada se odlucim za embedding i vidim da su podaci vrlo usko povezani i da nece biti potrebe za posebni query-anjem kolekcije koja se embeduje

  // Proveri da li posstoje 2 nacina embedovanja: Embedovanje cele kolekcije u drugu ili po id-u i pre-document middleware-u

  this.tourGuides = tourGuides;

  next();
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
export { TourType };
