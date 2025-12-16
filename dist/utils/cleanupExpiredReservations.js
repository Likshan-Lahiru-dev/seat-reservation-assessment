"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCleanupExpiredReservationsJob = startCleanupExpiredReservationsJob;
const node_cron_1 = __importDefault(require("node-cron"));
const pool_1 = require("../db/pool");
function startCleanupExpiredReservationsJob() {
    node_cron_1.default.schedule("5 0 * * *", async () => {
        try {
            const { rowCount } = await pool_1.pool.query(`
        DELETE FROM reservations r
        USING shows s
        WHERE r.show_id = s.id
          AND s.end_time < NOW()
      `);
            console.log(`[cleanup] Deleted expired reservations: ${rowCount ?? 0}`);
        }
        catch (err) {
            console.error("[cleanup] Failed:", err);
        }
    });
}
