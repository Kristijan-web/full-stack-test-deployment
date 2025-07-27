class AppError extends Error {
    statusCode;
    status;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = String(statusCode).startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default AppError;
