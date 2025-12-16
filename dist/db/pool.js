"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
function buildConfig() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error("DATABASE_URL is missing in environment variables");
    }
    const isNeon = url.includes("neon.tech");
    return {
        connectionString: url,
        ssl: isNeon ? { rejectUnauthorized: false } : undefined
    };
}
exports.pool = new pg_1.Pool(buildConfig());
