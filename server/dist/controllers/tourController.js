import Tour from "../models/tourModel.js";
import catchAsync from "../utills/catchAsync.js";
import AppError from "../utills/appError.js";
import { createOne, getAll, getOne } from "./handleFactory.js";
function sendResponse(res, data) {
    res.json({
        data: "ALO KORISTI FACTORY",
    });
}
const filterTourBody = (req, res, next) => {
    req.body = {
        tourName: req.body.tourName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        guides: req.body.guides,
        leadGuide: req.body.leadGuide,
        tours: req.body.tours,
        tourCover: req.body.tourCover,
    };
    next();
};
const getTours = getAll(Tour);
const getTour = getOne(Tour);
const createTour = createOne(Tour);
const updateTour = catchAsync(async (req, res, next) => {
    // u update objektu ne sme da bude koje ne zelimo da neko update-a, u ovom slucaju je ok da mogu sva polja da se izmene
    const { id } = req?.params;
    if (!id) {
        return next(new AppError("Provided id is not valid", 404));
    }
    let updatedTourArray = [];
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
    });
    if (!updatedTour) {
        return next(new AppError("Failed to update Tour, check provided id", 404));
    }
    updatedTourArray.push(updatedTour);
    sendResponse(res, updatedTourArray);
});
export { getTours, getTour, createTour, updateTour, filterTourBody };
