import AppError from "../utills/appError.js";
import catchAsync from "../utills/catchAsync.js";
import { HydratedDocument, Model } from "mongoose";
import { Response } from "express";

function sendResponse<T>(
  res: Response,
  dataToSend: HydratedDocument<T> | HydratedDocument<T>[],
  statusCode: number
) {
  res.status(statusCode).json({
    message: "success",
    data: {
      dataToSend,
    },
  });
}
const createOne = <T>(Model: Model<T>) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    if (!doc) {
      return next(new AppError("Failed to create document", 400));
    }
    sendResponse(res, doc, 200);
  });
};

const getOne = <T>(Model: Model<T>) => {
  return catchAsync(async (req, res, next) => {
    // id se nalazu params od request
    const { id } = req.params;
    const doc = await Model.findById(id);
    if (!doc) {
      return new AppError("Provided id does not exist", 404);
    }
    sendResponse(res, doc, 200);
  });
};

const getAll = <T>(Model: Model<T>) => {
  return catchAsync(async (req, res, next) => {
    const allDocs = await Model.find();
    if (!allDocs) {
      return next(new AppError("Provided id does not exist", 404));
    }
    sendResponse(res, allDocs, 200);
  });
};

export { createOne, getOne, getAll };
