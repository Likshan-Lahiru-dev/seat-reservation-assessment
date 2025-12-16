"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seatsRoutes = void 0;
const express_1 = require("express");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validate_1 = require("../middleware/validate");
const seat_schemas_1 = require("../schemas/seat.schemas");
const seatsController = __importStar(require("../controllers/seats.controller"));
exports.seatsRoutes = (0, express_1.Router)();
exports.seatsRoutes.get("/", (0, validate_1.validate)(seat_schemas_1.listSeatsSchema), (0, asyncHandler_1.asyncHandler)(seatsController.listSeats));
exports.seatsRoutes.post("/", (0, validate_1.validate)(seat_schemas_1.createSeatSchema), (0, asyncHandler_1.asyncHandler)(seatsController.createSeat));
exports.seatsRoutes.get("/by-show/:showId", (0, validate_1.validate)(seat_schemas_1.listSeatsByShowSchema), (0, asyncHandler_1.asyncHandler)(seatsController.listSeatsByShow));
