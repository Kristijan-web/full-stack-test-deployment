import AppError from "../utills/appError.js";
import catchAsync from "../utills/catchAsync.js";
function sendResponse(res, dataToSend, statusCode) {
    res.status(statusCode).json({
        message: "success",
        data: dataToSend,
    });
}
const getAll = (Model) => {
    return catchAsync(async (req, res, next) => {
        const allDocs = await Model.find();
        if (!allDocs) {
            return next(new AppError("Provided id does not exist", 404));
        }
        sendResponse(res, allDocs, 200);
    });
};
const getOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        // id se nalazu params od request
        const { id } = req.params;
        const doc = await Model.findById(id).select("-password -passwordChangedAt");
        if (!doc) {
            return new AppError("Provided id does not exist", 404);
        }
        // OVO DA se izmeni
        // if (doc instanceof User) {
        //   doc.password = undefined as any;
        //   doc.passwordChangedAt = undefined as any;
        // }
        sendResponse(res, doc, 200);
    });
};
const createOne = (Model) => {
    return catchAsync(async function (req, res, next) {
        console.log("EVO GA BODY U FACTORY", req.body);
        const doc = await Model.create(req.body);
        if (!doc) {
            return next(new AppError("Failed to create document", 400));
        }
        sendResponse(res, doc, 200);
    });
};
const deleteOne = (Model) => {
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
