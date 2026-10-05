import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');
mkdirSync(dataDir, { recursive: true });

export const db = new Database(join(dataDir, 'app.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        username      TEXT    NOT NULL UNIQUE,
        email         TEXT    NOT NULL UNIQUE,
        password_hash TEXT    NOT NULL,
        created_at    INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS comments (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        pin_id     INTEGER NOT NULL,
        user_id    INTEGER NOT NULL,
        text       TEXT    NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_comments_pin
        ON comments(pin_id, created_at);

    /* ★ 新增：用户点赞/保存的 pin */
    CREATE TABLE IF NOT EXISTS saves (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id    INTEGER NOT NULL,
        pin_id     INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        UNIQUE(user_id, pin_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_saves_user
        ON saves(user_id, created_at DESC);
`);

console.log('[db] ready at data/app.db');