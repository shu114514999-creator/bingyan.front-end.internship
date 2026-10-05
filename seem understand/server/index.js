import './db.js';
import express from 'express';
import session from 'express-session';
import SqliteStoreFactory from 'better-sqlite3-session-store';
import cookieParser from 'cookie-parser';
import { db } from './db.js';
import { authRouter } from './auth.js';
import { commentsRouter } from './comments.js';
import { savesRouter } from './saves.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

const SqliteStore = SqliteStoreFactory(session);

app.use(session({
    store: new SqliteStore({
        client: db,
        expired: {
            clear: true,
            intervalMs: 15 * 60 * 1000
        }
    }),
    secret: 'dev-secret-change-me-in-prod',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
}));

app.use('/api/auth', authRouter);
app.use('/api', commentsRouter);
app.use('/api', savesRouter);

app.get('/api/health', (req, res) => {
    res.json({ ok: true, time: Date.now() });
});

app.listen(PORT, () => {
    console.log(`[api] http://localhost:${PORT}`);
});