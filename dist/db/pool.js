"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
function buildConfig() {
    if (process.env.DATABASE_URL) {
        return { connectionString: process.env.DATABASE_URL };
    }
    return {
        host: process.env.PGHOST ?? "localhost",
        port: Number(process.env.PGPORT ?? 5432),
        user: process.env.PGUSER ?? "root",
        password: process.env.PGPASSWORD ?? "LahiruDev123",
        database: process.env.PGDATABASE ?? "reservation_db"
    };
}
exports.pool = new pg_1.Pool(buildConfig());
exports.pool.on("error", (err) => {
    console.error("Unexpected PG pool error:", err);
});
