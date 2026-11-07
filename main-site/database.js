const { createClient } = require('@libsql/client/http');
require('dotenv').config();

// RULE 1: Convert libsql:// to https://
const rawUrl = process.env.LIBSQL_URL || '';
const dbUrl = rawUrl.replace(/^libsql:\/\//, 'https://');

const db = createClient({
    url: dbUrl,
    authToken: process.env.LIBSQL_AUTH_TOKEN
});

// Initialize tables if they don't exist
const initDb = async () => {
    if (!dbUrl) return;
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL
            )
        `);
        await db.execute(`
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                date TEXT,
                weight REAL,
                height REAL,
                bmi_value REAL,
                bmi_category TEXT,
                goal TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);
        await db.execute(`
            CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                username TEXT,
                rating INTEGER,
                comment TEXT,
                created_at TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);
        console.log("Turso DB tables initialized.");
    } catch(e) {
        console.error("DB init error", e);
    }
};

initDb();

// Wrapper to mimic sqlite3 API for easy transition
module.exports = {
    get: async (query, params, cb) => {
        try {
            const result = await db.execute({ sql: query, args: params || [] });
            cb(null, result.rows.length > 0 ? result.rows[0] : undefined);
        } catch (e) { cb(e, null); }
    },
    all: async (query, params, cb) => {
        try {
            const result = await db.execute({ sql: query, args: params || [] });
            cb(null, result.rows);
        } catch (e) { cb(e, null); }
    },
    run: async (query, params, cb) => {
        try {
            const result = await db.execute({ sql: query, args: params || [] });
            cb.call({ lastID: result.lastInsertRowid ? Number(result.lastInsertRowid) : 0, changes: result.rowsAffected }, null);
        } catch (e) { cb.call({ lastID: 0, changes: 0 }, e); }
    }
};
