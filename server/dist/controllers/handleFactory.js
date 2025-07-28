import AppError from "../utills/appError.js";
import catchAsync from "../utills/catchAsync.js";
function sendResponse(res, dataToSend, statusCode) {
    res.status(statusCode).json({
        message: "success",
        data: {
            dataToSend,
        },
    });
}
const createOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);
        if (!doc) {
            return next(new AppError("Failed to create document", 400));
        }
        sendResponse(res, doc, 200);
    });
};
const getOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        // id se nalazu params od request
        const { id } = req.params;
        const doc = await Model.findById(id);
        if (!doc) {
            return new AppError("Provided id does not exist", 404);
        }
        sendResponse(res, doc, 200);
    });
};
const getAll = (Model) => {
    return catchAsync(async (req, res, next) => {
        const allDocs = await Model.find();
        if (!allDocs) {
            return next(new AppError("Provided id does not exist", 404));
        }
        sendResponse(res, allDocs, 200);
    });
};
export { createOne, getOne, getAll };
