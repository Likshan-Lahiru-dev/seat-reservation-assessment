"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = require("../utils/appError");
const http_1 = require("../utils/http");
function isPgError(err) {
    return !!err && typeof err === "object" && typeof err.code === "string";
}
function conflict(code, message, err) {
    return {
        error: {
            code,
            message,
            details: { constraint: err.constraint, detail: err.detail, table: err.table }
        }
    };
}
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof appError_1.AppError) {
        return res.status(err.status).json({
            error: { code: err.code, message: err.message, details: err.details }
        });
    }
    if (isPgError(err) && err.code === "23505") {
        switch (err.constraint) {
            case "reservation_items_show_id_seat_id_key":
                return res.status(http_1.HttpStatus.CONFLICT).json({
                    error: {
                        code: "ALREADY_RESERVED",
                        message: "These seat(s) are already booked for this show time."
                    }
                });
            case "seats_theatre_id_label_key":
                return res.status(http_1.HttpStatus.CONFLICT).json({
                    error: {
                        code: "SEAT_ALREADY_EXISTS",
                        message: "A seat with this label already exists in the theatre."
                    }
                });
            case "users_email_key":
                return res.status(http_1.HttpStatus.CONFLICT).json({
                    error: {
                        code: "EMAIL_ALREADY_EXISTS",
                        message: "A user with this email already exists."
                    }
                });
            case "users_nic_key":
                return res.status(http_1.HttpStatus.CONFLICT).json({
                    error: {
                        code: "NIC_ALREADY_EXISTS",
                        message: "A user with this NIC already exists."
                    }
                });
            default:
                return res.status(http_1.HttpStatus.CONFLICT).json({
                    error: {
                        code: "UNIQUE_VIOLATION",
                        message: "Duplicate value violates a unique constraint.",
                        details: { constraint: err.constraint, detail: err.detail }
                    }
                });
        }
    }
    console.error("Unhandled error:", err);
    return res.status(http_1.HttpStatus.INTERNAL).json({
        error: { code: "INTERNAL_ERROR", message: "Something went wrong." }
    });
};
exports.errorHandler = errorHandler;
