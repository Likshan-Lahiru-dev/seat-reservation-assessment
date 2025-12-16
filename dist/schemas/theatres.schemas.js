"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTheatreSchema = void 0;
const zod_1 = require("zod");
exports.createTheatreSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        imageUrl: zod_1.z.string().url().optional(),
        rating: zod_1.z.number().min(0).max(5).optional(),
        location: zod_1.z.string().min(1).optional()
    })
});
