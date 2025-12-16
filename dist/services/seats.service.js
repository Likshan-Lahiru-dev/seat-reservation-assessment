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
exports.listSeats = listSeats;
exports.createSeat = createSeat;
exports.listSeatsByShow = listSeatsByShow;
const seatsRepo = __importStar(require("../repositories/seats.repo"));
const withTransaction_1 = require("../db/withTransaction");
const appError_1 = require("../utils/appError");
const http_1 = require("../utils/http");
const moviesRepo = __importStar(require("../repositories/movies.repo"));
async function listSeats(theatreId) {
    return seatsRepo.listSeats(theatreId);
}
async function createSeat(input) {
    return seatsRepo.createSeat(input);
}
async function listSeatsByShow(showId) {
    return (0, withTransaction_1.withTransaction)(async (client) => {
        const show = await moviesRepo.getShowById(client, showId);
        if (!show) {
            throw new appError_1.AppError({
                status: http_1.HttpStatus.NOT_FOUND,
                code: "SHOW_NOT_FOUND",
                message: "Show not found"
            });
        }
        const rows = await seatsRepo.listSeatsWithReservationStatusByShow(client, showId);
        return rows.map((r) => ({
            id: r.id,
            theatre_id: r.theatre_id,
            label: r.label,
            created_at: r.created_at,
            reservationStatus: r.reservation_status
        }));
    });
}
