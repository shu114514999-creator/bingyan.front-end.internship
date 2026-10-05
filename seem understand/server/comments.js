import { Router } from 'express';
import { db } from './db.js';
import { requireAuth } from './auth.js';

export const commentsRouter = Router();

function selectOne(id) {
    return db.prepare(`
        SELECT c.id, c.pin_id, c.user_id, c.text, c.created_at,
               u.username
        FROM comments c
        JOIN users u ON u.id = c.user_id
        WHERE c.id = ?
    `).get(id);
}

function toDto(row) {
    return {
        id: row.id,
        pinId: row.pin_id,
        userId: row.user_id,
        author: row.username,
        text: row.text,
        createdAt: row.created_at
    };
}

/* ---------- GET 某 pin 的所有评论 ---------- */
commentsRouter.get('/pins/:pinId/comments', (req, res) => {
    const pinId = Number(req.params.pinId);
    if (!Number.isInteger(pinId) || pinId <= 0) {
        return res.status(400).json({ error: 'pinId 不合法' });
    }

    const rows = db.prepare(`
        SELECT c.id, c.pin_id, c.user_id, c.text, c.created_at,
               u.username
        FROM comments c
        JOIN users u ON u.id = c.user_id
        WHERE c.pin_id = ?
        ORDER BY c.created_at ASC
    `).all(pinId);

    res.json({ comments: rows.map(toDto) });
});

/* ---------- POST 发评论（需登录） ---------- */
commentsRouter.post('/pins/:pinId/comments', requireAuth, (req, res) => {
    const pinId = Number(req.params.pinId);
    if (!Number.isInteger(pinId) || pinId <= 0) {
        return res.status(400).json({ error: 'pinId 不合法' });
    }

    const text = String(req.body?.text ?? '').trim();
    if (!text) return res.status(400).json({ error: '评论内容不能为空' });
    if (text.length > 500) return res.status(400).json({ error: '评论最多 500 字' });

    const info = db.prepare(
        'INSERT INTO comments (pin_id, user_id, text, created_at) VALUES (?, ?, ?, ?)'
    ).run(pinId, req.session.userId, text, Date.now());

    const row = selectOne(info.lastInsertRowid);
    res.status(201).json({ comment: toDto(row) });
});

/* ---------- DELETE 删评论（只能删自己的） ---------- */
commentsRouter.delete('/comments/:id', requireAuth, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'id 不合法' });
    }

    const row = db.prepare(
        'SELECT id, user_id FROM comments WHERE id = ?'
    ).get(id);

    if (!row) return res.status(404).json({ error: '评论不存在' });
    if (row.user_id !== req.session.userId) {
        return res.status(403).json({ error: '只能删除自己的评论' });
    }

    db.prepare('DELETE FROM comments WHERE id = ?').run(id);
    res.json({ ok: true });
});