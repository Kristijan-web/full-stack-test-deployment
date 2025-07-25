function handleDevelopment(error, res) {
    res.status(500).json({
        error,
        message: error.message,
        stack: error.stack,
    });
}
function handleError(error, req, res, next) {
    if (process.env.NODE_ENV === "development") {
        handleDevelopment(error, res);
    }
    else {
        // za production
    }
}
export default handleError;
