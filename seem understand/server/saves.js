import { Router } from 'express';
import { db } from './db.js';
import { requireAuth } from './auth.js';

export const savesRouter = Router();

/* ---------- 保存 pin（幂等） ---------- */
savesRouter.post('/pins/:pinId/save', requireAuth, (req, res) => {
    const pinId = Number(req.params.pinId);
    if (!Number.isInteger(pinId) || pinId <= 0) {
        return res.status(400).json({ error: 'pinId 不合法' });
    }

    db.prepare(
        'INSERT OR IGNORE INTO saves (user_id, pin_id, created_at) VALUES (?, ?, ?)'
    ).run(req.session.userId, pinId, Date.now());

    res.json({ ok: true, saved: true });
});

/* ---------- 取消保存 ---------- */
savesRouter.delete('/pins/:pinId/save', requireAuth, (req, res) => {
    const pinId = Number(req.params.pinId);
    if (!Number.isInteger(pinId) || pinId <= 0) {
        return res.status(400).json({ error: 'pinId 不合法' });
    }

    db.prepare('DELETE FROM saves WHERE user_id = ? AND pin_id = ?')
        .run(req.session.userId, pinId);

    res.json({ ok: true, saved: false });
});

/* ---------- 我的已保存 pinIds ---------- */
savesRouter.get('/me/saves', requireAuth, (req, res) => {
    const rows = db.prepare(
        'SELECT pin_id FROM saves WHERE user_id = ? ORDER BY created_at DESC'
    ).all(req.session.userId);

    res.json({
        pinIds: rows.map(r => r.pin_id),
        count: rows.length
    });
});

/* ---------- 任意用户的已保存 pinIds ---------- */
savesRouter.get('/users/:username/saves', (req, res) => {
    const { username } = req.params;
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        return res.status(400).json({ error: '用户名不合法' });
    }

    const u = db.prepare(
        'SELECT id, username FROM users WHERE username = ?'
    ).get(username);
    if (!u) return res.status(404).json({ error: '用户不存在' });

    const rows = db.prepare(
        'SELECT pin_id FROM saves WHERE user_id = ? ORDER BY created_at DESC'
    ).all(u.id);

    res.json({
        user: { id: u.id, username: u.username },
        pinIds: rows.map(r => r.pin_id),
        count: rows.length
    });
});