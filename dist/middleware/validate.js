"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const appError_1 = require("../utils/appError");
const http_1 = require("../utils/http");
function validate(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        if (!result.success) {
            return next(new appError_1.AppError({
                status: http_1.HttpStatus.UNPROCESSABLE,
                code: "VALIDATION_ERROR",
                message: "Request validation failed.",
                details: result.error.flatten()
            }));
        }
        req.validated = result.data;
        next();
    };
}
