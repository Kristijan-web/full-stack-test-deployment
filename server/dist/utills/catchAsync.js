// prima asinhronu funkciju kao parametar a ta asinhrona funkcija treba da sadrzi 3 parametra
function catchAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    };
}
export default catchAsync;
