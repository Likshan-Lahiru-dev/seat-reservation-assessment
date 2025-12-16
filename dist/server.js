"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const pool_1 = require("./db/pool");
const cleanupExpiredReservations_1 = require("./utils/cleanupExpiredReservations");
const PORT = Number(process.env.PORT ?? 4000);
async function start() {
    await pool_1.pool.query("SELECT 1");
    (0, cleanupExpiredReservations_1.startCleanupExpiredReservationsJob)();
    const app = (0, app_1.createApp)();
    app.listen(PORT, () => {
        console.log(`API listening on http://localhost:${PORT}`);
    });
}
start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
