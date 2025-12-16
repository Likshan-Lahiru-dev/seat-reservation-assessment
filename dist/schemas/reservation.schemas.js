"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelReservationSchema = exports.listReservationsSchema = exports.createReservationSchema = void 0;
const zod_1 = require("zod");
exports.createReservationSchema = zod_1.z.object({
    body: zod_1.z.object({
        showId: zod_1.z.string().uuid(),
        seatIds: zod_1.z.array(zod_1.z.string().uuid()).min(1),
        user: zod_1.z.object({
            name: zod_1.z.string().min(1),
            email: zod_1.z.string().email(),
            nic: zod_1.z.string().min(5)
        })
    })
});
exports.listReservationsSchema = zod_1.z.object({
    query: zod_1.z.object({
        showId: zod_1.z.string().uuid().optional(),
        seatId: zod_1.z.string().uuid().optional(),
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional()
    })
});
exports.cancelReservationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
