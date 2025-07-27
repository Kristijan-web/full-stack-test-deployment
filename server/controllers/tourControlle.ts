import Tour from "../models/tourModel.js";
import catchAsync from "../utills/catchAsync.js";
import AppError from "../utills/appError.js";
import { Response } from "express";
import { TourType } from "../models/tourModel.js";

function sendResponse(res: Response, data: TourType[]) {}

const getTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  // da li je greska ako je tours prazan niz, nije, neka frontend misli o tome
  sendResponse(res, tours);
});

const getTour = catchAsync(async (req, res, next) => {
  const { id } = req?.params;
  if (!id) {
    return next(new AppError("Provided id is not valid", 404));
  }
  const tour = await Tour.find({ id });

  sendResponse(res, tour);
});

const createTour = catchAsync(async (req, res, next) => {
  // mora se biti autorizovan da bi se mogla pozvati ova funkcija

  const newTour = await Tour.create([
    {
      tourName: req.body.tourName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      guides: req.body.guides,
      leadGuide: req.body.leadGuide,
      tours: req.body.tours,
      // ovo dole cu vrv morati da izmenim jer cu koristiti multer za rad sa slikama
      tourCover: req.body.tourCover,
    },
  ]);

  sendResponse(res, newTour);
});

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

export { getTours, getTour, createTour, updateTour };
