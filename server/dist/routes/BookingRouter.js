import express from "express";
import { createBooking, getBooking } from "../controllers/bookingController.js";
const bookingRouter = express.Router();
// Treba dodati middleware za filtraciju polja, jer u Model.create ide ceo objekat Model.create(req.body)
bookingRouter.get("/:id", getBooking);
bookingRouter.post("/", createBooking);
export default bookingRouter;
