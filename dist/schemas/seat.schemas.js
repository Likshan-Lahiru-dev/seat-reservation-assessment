"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSeatsByShowSchema = exports.createSeatSchema = exports.listSeatsSchema = void 0;
const zod_1 = require("zod");
exports.listSeatsSchema = zod_1.z.object({
    query: zod_1.z.object({
        theatreId: zod_1.z.string().uuid().optional()
    })
});
exports.createSeatSchema = zod_1.z.object({
    body: zod_1.z.object({
        theatreId: zod_1.z.string().uuid(),
        label: zod_1.z.string().min(1)
    })
});
exports.listSeatsByShowSchema = zod_1.z.object({
    params: zod_1.z.object({
        showId: zod_1.z.string().uuid()
    })
});
