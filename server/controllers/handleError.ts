import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  isOperational: boolean;
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
  if (process.env.NODE_ENV === "development") {
    handleDevelopment(error, res);
  } else {
    // za production
  }
}

export default handleError;
