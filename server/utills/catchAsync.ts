import { Request, Response, NextFunction } from "express";

// prima asinhronu funkciju kao parametar a ta asinhrona funkcija treba da sadrzi 3 parametra

function catchAsync(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => next(err));
  };
}

export default catchAsync;
