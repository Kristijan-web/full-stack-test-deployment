import AppError from "../utills/appError.js";
import catchAsync from "../utills/catchAsync.js";
import { HydratedDocument, Model } from "mongoose";
import { Response } from "express";
import type { UserType } from "../models/userModel.js";
function sendResponse<T>(
  res: Response,
  dataToSend: HydratedDocument<T> | HydratedDocument<T>[],
  statusCode: number
) {
  res.status(statusCode).json({
    message: "success",
    data: dataToSend,
  });
}
const getAll = <T>(Model: Model<T>) => {
  return catchAsync(async (req, res, next) => {
    const allDocs = await Model.find();
    if (!allDocs) {
      return next(new AppError("Provided id does not exist", 404));
    }
    sendResponse(res, allDocs, 200);
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
    // OVO DA se izmeni
    if (doc instanceof HydratedDocument<UserType>) {
      doc.password = undefined;
    }
    sendResponse(res, doc, 200);
  });
};

const createOne = <T>(Model: Model<T>) => {
  return catchAsync(async function (req, res, next) {
    const doc = await Model.create(req.body);
    if (!doc) {
      return next(new AppError("Failed to create document", 400));
    }
    sendResponse(res, doc, 200);
  });
};

const deleteOne = <T>(Model: Model<T>) => {
  return catchAsync(async (req, res, next) => {
    const id = req.params;
    const deletedDoc = await Model.findByIdAndDelete(id);
    if (!deletedDoc) {
      return next(new AppError("Failed to delete", 400));
    }
    sendResponse(res, deletedDoc, 204);
  });
};

export { getAll, getOne, createOne, deleteOne };
