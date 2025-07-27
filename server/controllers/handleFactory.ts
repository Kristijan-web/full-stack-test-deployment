import AppError from "../utills/appError.js";
import catchAsync from "../utills/catchAsync.js";
import { HydratedDocument, Model } from "mongoose";
import { Response } from "express";

function sendResponse<T>(
  res: Response,
  data: HydratedDocument<T>,
  statusCode: number
) {}
// hydratedDocument znaci da saljem instanciran model const x = await User.find() ovo je instanciran model
const createOne = <T extends HydratedDocument>(Model: Model<T>) => {
  return catchAsync(async (req, res, next) => {
    // mora da se napravi middleware koji ce se proslediti ruti da bi se filtirao body
    const doc = await Model.create(req.body);
    if (!doc) {
      return next(new AppError("Failed to create document", 400));
    }
    sendResponse(res, doc, 200);
  });
};

export { createOne };
