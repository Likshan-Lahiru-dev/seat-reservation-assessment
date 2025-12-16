"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const appError_1 = require("../utils/appError");
const http_1 = require("../utils/http");
const notFound = (req, _res, next) => {
    next(new appError_1.AppError({
        status: http_1.HttpStatus.NOT_FOUND,
        code: "NOT_FOUND",
        message: `Route not found: ${req.method} ${req.path}`
    }));
};
exports.notFound = notFound;
