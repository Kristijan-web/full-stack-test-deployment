import AppError from "../utills/appError.js";
import mongoose from "mongoose";
function handleInvalidID(error) {
    return new AppError(`Invalid ${error.path}`, 401);
}
function handleValidationMongoose(error) {
    return new AppError(error.message, 401);
}
function handleProduction(error, res) {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        isOperational: error.isOperational,
    });
}
function handleDevelopment(error, res) {
    res.status(500).json({
        error,
        message: error.message,
        stack: error.stack,
    });
}
function handleError(error, req, res, next) {
    let err = error;
    // setting default values for generic Error
    (err.statusCode = err.statusCode || 500), (err.status = err.status || "fail");
    err.isOperational = err.isOperational || false;
    if (process.env.NODE_ENV === "development") {
        handleDevelopment(err, res);
    }
    else {
        // za production
        if (err.name === "CastError" && err instanceof mongoose.Error.CastError) {
            // za invalid id
            err = handleInvalidID(err);
        }
        if (err.name === "ValidationError") {
            err = handleValidationMongoose(err);
        }
        handleProduction(err, res);
    }
}
export default handleError;
// sta je problem?
// kada se desi mongoose validation greska ona ima statusCode 500 i nije operational sto nije tacno
// da li da koristim new AppError (ne onda bi upadao u infinite loop), IPAK necu upasti u infinite loop jer nisam AppError stavio u next() DOKTORE
// da u handleValidationMongoose rucno dodam error.isOperationa: true i statusCode: 401
