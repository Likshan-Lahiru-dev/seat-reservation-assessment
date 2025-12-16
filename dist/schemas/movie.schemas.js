"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listShowsByMovieSchema = exports.listMoviesSchema = exports.createMovieSchema = void 0;
const zod_1 = require("zod");
const hhmm = zod_1.z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:mm (e.g., 19:30)");
exports.createMovieSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1),
        imageUrl: zod_1.z.string().url().optional(),
        theatreId: zod_1.z.string().uuid(),
        startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "startDate must be YYYY-MM-DD"),
        endDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "endDate must be YYYY-MM-DD"),
        showTimes: zod_1.z.array(hhmm).min(1),
        durationMinutes: zod_1.z.number().int().positive(),
        timezone: zod_1.z.string().min(1)
    })
});
exports.listMoviesSchema = zod_1.z.object({
    query: zod_1.z.object({}).optional()
});
exports.listShowsByMovieSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
