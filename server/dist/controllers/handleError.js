function handleProduction(error, res) {
    res.status(error.statusCode).json({
        status: error.status,
        statusCode: error.statusCode,
        message: error.message,
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
    console.log(error);
    const err = error;
    // setting default values for generic Error
    (err.statusCode = err.statusCode || 500), (err.status = err.status || "fail");
    err.isOperational = err.isOperational || false;
    if (process.env.NODE_ENV === "development") {
        handleDevelopment(err, res);
    }
    else {
        // za production
        handleProduction(err, res);
    }
}
export default handleError;
