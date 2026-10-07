import { Router } from 'express';
import { db } from './db.js';
import { requireAuth } from './auth.js';

export const reactionsRouter = Router();

function countFor(pinId) {
    const row = db.prepare(
        'SELECT COUNT(*) AS n FROM reactions WHERE pin_id = ?'
    ).get(pinId);
    return row?.n ?? 0;
}

function hasReacted(userId, pinId) {
    if (!userId) return false;
    const row = db.prepare(
        'SELECT 1 FROM reactions WHERE user_id = ? AND pin_id = ?'
    ).get(userId, pinId);
    return Boolean(row);
}

/* ---------- 点赞 ---------- */
reactionsRouter.post('/pins/:pinId/react', requireAuth, (req, res) => {
    const pinId = Number(req.params.pinId);
    if (!Number.isInteger(pinId) || pinId <= 0) {
        return res.status(400).json({ error: 'pinId 不合法' });
    }

    db.prepare(
        'INSERT OR IGNORE INTO reactions (user_id, pin_id, created_at) VALUES (?, ?, ?)'
    ).run(req.session.userId, pinId, Date.now());

    res.json({
        ok: true,
        reacted: true,
        count: countFor(pinId)
    });
});

/* ---------- 取消点赞 ---------- */
reactionsRouter.delete('/pins/:pinId/react', requireAuth, (req, res) => {
    const pinId = Number(req.params.pinId);
    if (!Number.isInteger(pinId) || pinId <= 0) {
        return res.status(400).json({ error: 'pinId 不合法' });
    }

    db.prepare('DELETE FROM reactions WHERE user_id = ? AND pin_id = ?')
        .run(req.session.userId, pinId);

    res.json({
        ok: true,
        reacted: false,
        count: countFor(pinId)
    });
});

/* ---------- 某 pin 的点赞数 + 我是否点过 ---------- */
reactionsRouter.get('/pins/:pinId/reactions', (req, res) => {
    const pinId = Number(req.params.pinId);
    if (!Number.isInteger(pinId) || pinId <= 0) {
        return res.status(400).json({ error: 'pinId 不合法' });
    }

    res.json({
        count: countFor(pinId),
        reacted: hasReacted(req.session.userId, pinId)
    });
});