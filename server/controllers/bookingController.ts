import Booking from "../models/BookingModel.js";
import { createOne, getOne } from "./handleFactory.js";

const createBooking = createOne(Booking);

const getBooking = getOne(Booking);

export { createBooking, getBooking };
