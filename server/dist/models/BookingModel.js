import mongoose from "mongoose";
// Kako cu videti istoriju booking-a usera?
// - Tako sto cu filtrirati bookings po id-u usera
// Kako cu znati koji je zadnji kupljen tour?
// - Tako sto cu sortirati to purchaseDate
// Kako cu znati da je tour aktivan, to jest da je krenula prodaja
// - Imacu u tour-u polje active i tjt, kada se tour zavrsi ono se stavlja na false
// - Ovime mogu da prikazem aktivan tour za usera adminu
const bookingSchema = new mongoose.Schema({
    purchaseDate: {
        type: Date,
        default: Date.now(),
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User must exist for booking"],
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tour",
        required: [true, "Tour must exist for booking"],
    },
});
bookingSchema.pre(/^find/, function (next) {
    // Od cega pokusava typescript da me zastiti
    this.populate("user").populate("tour");
    next();
});
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
