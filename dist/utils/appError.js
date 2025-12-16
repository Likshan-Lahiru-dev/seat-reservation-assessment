"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    status;
    code;
    details;
    constructor(opts) {
        super(opts.message);
        this.status = opts.status;
        this.code = opts.code;
        this.details = opts.details;
    }
}
exports.AppError = AppError;
