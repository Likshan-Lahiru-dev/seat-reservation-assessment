"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMovie = createMovie;
exports.createShowsBulk = createShowsBulk;
exports.listShowsByMovie = listShowsByMovie;
exports.getShowById = getShowById;
exports.listMoviesWithShows = listMoviesWithShows;
const pool_1 = require("../db/pool");
async function createMovie(client, input) {
    const q = `
        INSERT INTO movies (title, image_url)
        VALUES ($1, $2)
            RETURNING *;
    `;
    const { rows } = await client.query(q, [input.title, input.imageUrl ?? null]);
    return rows[0];
}
async function createShowsBulk(client, input) {
    const q = `
        INSERT INTO shows (movie_id, theatre_id, start_time, end_time)
        SELECT $1, $2, s, e
        FROM unnest($3::timestamptz[], $4::timestamptz[]) AS t(s, e)
            RETURNING *;
    `;
    const { rows } = await client.query(q, [input.movieId, input.theatreId, input.starts, input.ends]);
    return rows;
}
async function listShowsByMovie(movieId) {
    const { rows } = await pool_1.pool.query(`SELECT * FROM shows WHERE movie_id = $1 ORDER BY start_time ASC`, [movieId]);
    return rows;
}
async function getShowById(client, showId) {
    const { rows } = await client.query(`SELECT * FROM shows WHERE id = $1`, [showId]);
    return rows[0] ?? null;
}
async function listMoviesWithShows() {
    const q = `
    SELECT
      m.id,
      m.title,
      m.image_url,
      m.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', s.id,
            'theatre_id', s.theatre_id,
            'start_time', s.start_time,
            'end_time', s.end_time
          )
          ORDER BY s.start_time ASC
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'::json
      ) AS shows
    FROM movies m
    LEFT JOIN shows s ON s.movie_id = m.id
    GROUP BY m.id
    ORDER BY m.created_at DESC;
  `;
    const { rows } = await pool_1.pool.query(q);
    return rows;
}
