"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.asyncHandler = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
exports.ApiError = ApiError;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal server error";
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    console.error(`[${statusCode}] ${message}`, err);
    res.status(statusCode).json({
        error: message,
        status: statusCode,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map