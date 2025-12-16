import { Pool } from "pg";

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

export const pool = new Pool(buildConfig());
