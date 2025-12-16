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
exports.createReservation = createReservation;
exports.listReservations = listReservations;
exports.cancelReservation = cancelReservation;
const withTransaction_1 = require("../db/withTransaction");
const appError_1 = require("../utils/appError");
const http_1 = require("../utils/http");
const pagination_1 = require("../utils/pagination");
const usersRepo = __importStar(require("../repositories/users.repo"));
const moviesRepo = __importStar(require("../repositories/movies.repo"));
const seatsRepo = __importStar(require("../repositories/seats.repo"));
const reservationsRepo = __importStar(require("../repositories/reservations.repo"));
async function createReservation(input) {
    return (0, withTransaction_1.withTransaction)(async (client) => {
        const show = await moviesRepo.getShowById(client, input.showId);
        if (!show) {
            throw new appError_1.AppError({
                status: http_1.HttpStatus.NOT_FOUND,
                code: "SHOW_NOT_FOUND",
                message: "Show not found"
            });
        }
        try {
            await seatsRepo.validateSeatsBelongToTheatre(client, show.theatre_id, input.seatIds);
        }
        catch (e) {
            throw new appError_1.AppError({
                status: http_1.HttpStatus.BAD_REQUEST,
                code: "INVALID_SEATS",
                message: e?.message ?? "Invalid seats for theatre"
            });
        }
        const user = await usersRepo.findOrCreateUser(client, input.user);
        const reservation = await reservationsRepo.createReservationHeader(client, {
            showId: input.showId,
            userId: user.id
        });
        await reservationsRepo.insertReservationItems(client, {
            reservationId: reservation.id,
            showId: input.showId,
            seatIds: input.seatIds
        });
        return {
            id: reservation.id,
            showId: reservation.show_id,
            userId: reservation.user_id,
            createdAt: reservation.created_at
        };
    });
}
async function listReservations(input) {
    const { page, limit, offset } = (0, pagination_1.parsePagination)({ page: input.page, limit: input.limit });
    return (0, withTransaction_1.withTransaction)(async (client) => {
        const rows = await reservationsRepo.listReservations(client, {
            showId: input.showId,
            seatId: input.seatId,
            limit,
            offset
        });
        return {
            page,
            limit,
            count: rows.length,
            data: rows.map((r) => ({
                id: r.reservation_id,
                showId: r.show_id,
                userId: r.user_id,
                createdAt: r.created_at,
                user: r.user,
                movie: r.movie,
                show: r.show,
                seats: r.seats
            }))
        };
    });
}
async function cancelReservation(reservationId) {
    return (0, withTransaction_1.withTransaction)(async (client) => {
        const existing = await reservationsRepo.getReservationById(client, reservationId);
        if (!existing) {
            throw new appError_1.AppError({
                status: http_1.HttpStatus.NOT_FOUND,
                code: "RESERVATION_NOT_FOUND",
                message: "Reservation not found"
            });
        }
        await reservationsRepo.deleteReservationById(client, reservationId);
        return { deleted: true };
    });
}
