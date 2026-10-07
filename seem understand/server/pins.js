import { Router } from 'express';
import multer from 'multer';
import { mkdirSync } from 'node:fs';
import { extname, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { db } from './db.js';
import { requireAuth } from './auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, '..', 'data', 'uploads');
mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = (extname(file.originalname) || '.jpg').toLowerCase();
        cb(null, `${randomUUID()}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('只支持图片文件'));
        }
        cb(null, true);
    }
});

function toDto(row) {
    return {
        id: row.id,
        userId: row.user_id,
        username: row.username,
        image: row.image,
        width: row.width,
        height: row.height,
        title: row.title,
        description: row.description,
        link: row.link,
        createdAt: row.created_at,
        /* PinCard 需要的字段 */
        dominantColor: '#f1f1f1',
        reactions: 0,
        comments: []
    };
}

export const pinsRouter = Router();

/* ---------- 上传新 pin ---------- */
pinsRouter.post('/pins', requireAuth, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: '缺少图片文件' });

    const { title = '', description = '', link = '', width, height } = req.body;
    const w = Number(width) || null;
    const h = Number(height) || null;

    const imagePath = `/uploads/${req.file.filename}`;

    const info = db.prepare(`
        INSERT INTO pins (user_id, image, width, height, title, description, link, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        req.session.userId,
        imagePath,
        w,
        h,
        String(title).slice(0, 200),
        String(description).slice(0, 2000),
        String(link).slice(0, 500),
        Date.now()
    );

    const row = db.prepare(`
        SELECT p.*, u.username
        FROM pins p JOIN users u ON u.id = p.user_id
        WHERE p.id = ?
    `).get(info.lastInsertRowid);

    res.status(201).json({ pin: toDto(row) });
});

/* ---------- 全部上传的 pin（进首页瀑布流） ---------- */
pinsRouter.get('/pins', (req, res) => {
    const rows = db.prepare(`
        SELECT p.*, u.username
        FROM pins p JOIN users u ON u.id = p.user_id
        ORDER BY p.created_at DESC
        LIMIT 500
    `).all();

    res.json({ pins: rows.map(toDto) });
});

/* ---------- 某用户上传的所有 pin ---------- */
pinsRouter.get('/users/:username/pins', (req, res) => {
    const { username } = req.params;
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        return res.status(400).json({ error: '用户名不合法' });
    }

    const u = db.prepare(
        'SELECT id, username FROM users WHERE username = ?'
    ).get(username);
    if (!u) return res.status(404).json({ error: '用户不存在' });

    const rows = db.prepare(`
        SELECT p.*, u.username
        FROM pins p JOIN users u ON u.id = p.user_id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
    `).all(u.id);

    res.json({
        user: { id: u.id, username: u.username },
        pins: rows.map(toDto)
    });
});