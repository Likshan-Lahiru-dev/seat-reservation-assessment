"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTheatres = listTheatres;
exports.createTheatre = createTheatre;
const pool_1 = require("../db/pool");
async function listTheatres() {
    const { rows } = await pool_1.pool.query(`SELECT * FROM theatres ORDER BY created_at DESC`);
    return rows;
}
async function createTheatre(input) {
    const q = `
    INSERT INTO theatres (name, image_url, rating, location)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
    const { rows } = await pool_1.pool.query(q, [
        input.name,
        input.imageUrl ?? null,
        input.rating ?? null,
        input.location ?? null
    ]);
    return rows[0];
}
