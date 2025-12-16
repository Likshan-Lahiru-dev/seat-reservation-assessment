"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSeats = listSeats;
exports.createSeat = createSeat;
exports.validateSeatsBelongToTheatre = validateSeatsBelongToTheatre;
exports.listSeatsWithReservationStatusByShow = listSeatsWithReservationStatusByShow;
const pool_1 = require("../db/pool");
async function listSeats(theatreId) {
    if (theatreId) {
        const { rows } = await pool_1.pool.query(`SELECT * FROM seats WHERE theatre_id = $1 ORDER BY label ASC`, [theatreId]);
        return rows;
    }
    const { rows } = await pool_1.pool.query(`SELECT * FROM seats ORDER BY created_at DESC`);
    return rows;
}
async function createSeat(input) {
    const q = `
        INSERT INTO seats (theatre_id, label)
        VALUES ($1, $2)
            RETURNING *;
    `;
    const { rows } = await pool_1.pool.query(q, [input.theatreId, input.label]);
    return rows[0];
}
async function validateSeatsBelongToTheatre(client, theatreId, seatIds) {
    const { rows } = await client.query(`SELECT COUNT(*)::text AS count
         FROM seats
         WHERE theatre_id = $1 AND id = ANY($2::uuid[])`, [theatreId, seatIds]);
    const count = Number(rows[0]?.count ?? 0);
    if (count !== seatIds.length) {
        throw new Error("One or more seats are invalid for this theatre.");
    }
}
/**
 * Returns ALL seats in the theatre of the given showId,
 * with reservation status (true if already booked for that show).
 */
async function listSeatsWithReservationStatusByShow(client, showId) {
    const q = `
        SELECT
            s.id,
            s.theatre_id,
            s.label,
            s.created_at,
            EXISTS (
                SELECT 1
                FROM reservation_items ri
                WHERE ri.show_id = $1 AND ri.seat_id = s.id
            ) AS reservation_status
        FROM shows sh
                 JOIN seats s ON s.theatre_id = sh.theatre_id
        WHERE sh.id = $1
        ORDER BY s.label ASC;
    `;
    const { rows } = await client.query(q, [showId]);
    return rows;
}
