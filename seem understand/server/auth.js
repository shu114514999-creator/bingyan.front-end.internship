import { Router } from 'express';
import bcrypt from 'bcrypt';
import { db } from './db.js';

export const authRouter = Router();

const SALT_ROUNDS = 10;

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function pickUser(row) {
    if (!row) return null;
    return { id: row.id, username: row.username, email: row.email };
}

/* ---------- 注册 ---------- */
authRouter.post('/register', async (req, res) => {
    const { username, email, password } = req.body ?? {};

    if (!USERNAME_RE.test(username ?? '')) {
        return res.status(400).json({ error: '用户名需 3-20 位字母/数字/下划线' });
    }
    if (!EMAIL_RE.test(email ?? '')) {
        return res.status(400).json({ error: '邮箱格式不正确' });
    }
    if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: '密码至少 6 位' });
    }

    const dup = db.prepare(
        'SELECT id FROM users WHERE username = ? OR email = ?'
    ).get(username, email);
    if (dup) return res.status(409).json({ error: '用户名或邮箱已被注册' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const info = db.prepare(
        'INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)'
    ).run(username, email, hash, Date.now());

    const user = { id: info.lastInsertRowid, username, email };
    req.session.userId = user.id;
    res.status(201).json({ user });
});

/* ---------- 登录 ---------- */
authRouter.post('/login', async (req, res) => {
    const { identifier, password } = req.body ?? {};
    if (!identifier || !password) {
        return res.status(400).json({ error: '请填写账号和密码' });
    }

    const row = db.prepare(
        'SELECT * FROM users WHERE username = ? OR email = ?'
    ).get(identifier, identifier);

    if (!row) return res.status(401).json({ error: '账号或密码错误' });

    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: '账号或密码错误' });

    req.session.userId = row.id;
    res.json({ user: pickUser(row) });
});

/* ---------- 登出 ---------- */
authRouter.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ ok: true });
    });
});

/* ---------- 当前用户 ---------- */
authRouter.get('/me', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ user: null });

    const row = db.prepare(
        'SELECT id, username, email FROM users WHERE id = ?'
    ).get(req.session.userId);

    if (!row) {
        req.session.destroy(() => { });
        return res.status(401).json({ user: null });
    }
    res.json({ user: pickUser(row) });
});

export function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: '未登录' });
    }
    next();
}