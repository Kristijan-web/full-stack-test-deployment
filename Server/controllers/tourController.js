const AppError = require("../utills/appError");
const catchAsync = require("../utills/catchAsync");
const Tour = require("../models/tourModel");

function sendReponse(statusCode, responseData = null, res) {
  res.status(statusCode).json({
    message: statusCode < 400 ? "success" : "error",
    data: {
      responseData,
    },
  });
}

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create({
    tourName: req.body.tourName,
    tourPrice: req.body.tourPrice,
    tours: req.body.tours,
    tourGuide: req.body.tourGuide,
  });

  sendReponse(200, newTour, res);
});

const getTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  sendReponse(200, tours, res);
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  sendReponse(200, tour, res);
});

const updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  sendReponse(200, updatedTour, res);
});

module.exports = { getTours, createTour, updateTour, getTour };
