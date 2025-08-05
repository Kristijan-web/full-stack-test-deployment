import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  isOperational: boolean;
  statusCode: number;
  status: string;
}

function handleProduction(error: AppError, res: Response) {
  res.status(error.statusCode).json({
    status: error.status,
    statusCode: error.statusCode,
    message: error.message,
  });
}

function handleDevelopment(error: AppError | Error, res: Response) {
  res.status(500).json({
    error,
    message: error.message,
    stack: error.stack,
  });
}

function handleError(
  error: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);

  const err = error as AppError;

  // setting default values for generic Error
  (err.statusCode = err.statusCode || 500), (err.status = err.status || "fail");
  err.isOperational = err.isOperational || false;

  if (process.env.NODE_ENV === "development") {
    handleDevelopment(err, res);
  } else {
    // za production
    handleProduction(err, res);
  }
}

export default handleError;
