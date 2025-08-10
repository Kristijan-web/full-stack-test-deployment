import { Request, Response, NextFunction } from "express";
import AppError from "../utills/appError.js";
import mongoose from "mongoose";

interface AppErrorType extends Error {
  isOperational: boolean;
  statusCode: number;
  status: string;
}

type MongooseCastError = mongoose.Error.CastError;

type MongooseDuplicateError = mongoose.mongo.MongoServerError;

function handleDuplicate(err: MongooseDuplicateError) {
  let usedField;

  for (const key in err.keyValue) {
    usedField = key;
  }

  return new AppError(`${usedField} is already in use`, 409);
}
function handleInvalidID(error: MongooseCastError) {
  return new AppError(`Invalid ${error.path}`, 409);
}

function handleValidationMongoose(error: AppErrorType) {
  return new AppError(error.message, 401);
}

function handleProduction(error: AppErrorType, res: Response) {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    isOperational: error.isOperational,
  });
}

function handleDevelopment(error: AppErrorType | Error, res: Response) {
  res.status(500).json({
    error,
    message: error.message,
    stack: error.stack,
  });
}
function handleError(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let err = error as AppErrorType;
  // setting default values for generic Error
  (err.statusCode = err.statusCode || 500), (err.status = err.status || "fail");
  err.isOperational = err.isOperational || false;

  if (process.env.NODE_ENV === "development") {
    handleDevelopment(err, res);
  } else {
    // za production

    if (err.name === "CastError" && err instanceof mongoose.Error.CastError) {
      // za invalid id
      err = handleInvalidID(err);
    }

    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
      // duplicate key (field is unique)
      err = handleDuplicate(err);
    }

    if (err.name === "ValidationError") {
      // validation error
      err = handleValidationMongoose(err);
    }
    handleProduction(err, res);
  }
}

export default handleError;
