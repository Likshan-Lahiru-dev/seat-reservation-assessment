"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateUser = findOrCreateUser;
async function findOrCreateUser(client, input) {
    const q = `
    WITH existing AS (
      SELECT * FROM users WHERE email = $1 OR nic = $2 LIMIT 1
    ),
    ins AS (
      INSERT INTO users (name, email, nic)
      SELECT $3, $1, $2
      WHERE NOT EXISTS (SELECT 1 FROM existing)
      RETURNING *
    )
    SELECT * FROM ins
    UNION ALL
    SELECT * FROM existing
    LIMIT 1;
  `;
    const { rows } = await client.query(q, [input.email, input.nic, input.name]);
    return rows[0];
}
