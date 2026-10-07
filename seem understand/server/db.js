import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');
mkdirSync(dataDir, { recursive: true });
mkdirSync(join(dataDir, 'uploads'), { recursive: true });

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

    CREATE TABLE IF NOT EXISTS pins (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     INTEGER NOT NULL,
        image       TEXT    NOT NULL,
        width       INTEGER,
        height      INTEGER,
        title       TEXT    DEFAULT '',
        description TEXT    DEFAULT '',
        link        TEXT    DEFAULT '',
        created_at  INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_pins_user
        ON pins(user_id, created_at DESC);

    /* ★ 新增：点赞 */
    CREATE TABLE IF NOT EXISTS reactions (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id    INTEGER NOT NULL,
        pin_id     INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        UNIQUE(user_id, pin_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_reactions_pin
        ON reactions(pin_id);

    CREATE INDEX IF NOT EXISTS idx_reactions_user
        ON reactions(user_id, created_at DESC);
`);

console.log('[db] ready at data/app.db');