import { Pool } from "pg";

function buildConfig() {
    if (process.env.DATABASE_URL) {
        const isNeon = process.env.DATABASE_URL.includes("neon.tech");
        return {
            connectionString: process.env.DATABASE_URL,
            ssl: isNeon ? { rejectUnauthorized: false } : undefined
        };
    }

    return {
        host: process.env.PGHOST ?? "localhost",
        port: Number(process.env.PGPORT ?? 5432),
        user: process.env.PGUSER ?? "root",
        password: process.env.PGPASSWORD ?? "LahiruDev123",
        database: process.env.PGDATABASE ?? "reservation_db"
    };
}

export const pool = new Pool(buildConfig());
