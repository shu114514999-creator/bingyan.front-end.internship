import { PinGrid } from './PinGrid.js';
import { commentsApi } from '../api/comments.js';
import { savesApi } from '../api/saves.js';
import { getCurrentUser } from '../api/auth.js';

const PANEL_HTML = `
    <div class="detail-page__panel">
        <div class="detail-page__media">
            <div class="detail-page__image-wrap">
                <img class="detail-page__img" alt="">

                <div class="detail-page__overlay-layers">
                    <button class="detail-page__media-btn detail-page__media-btn--text" type="button" data-tooltip="查看大图" aria-label="View larger">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                            <path d="M23 1v9h-2V4.41l-6.3 6.3-1.4-1.42L19.58 3H14V1zM1 23v-9h2v5.59l6.3-6.3 1.4 1.42L4.42 21H10v2z"/>
                        </svg>
                        <span class="detail-page__media-btn-text">View larger</span>
                    </button>
                    <button class="detail-page__media-btn detail-page__media-btn--text" type="button" aria-label="Search image">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                            <path d="M19.64.62a5 5 0 0 0 3.74 3.74l.62.14v1l-.62.14a5 5 0 0 0-3.74 3.74l-.14.62h-1l-.14-.62a5 5 0 0 0-3.74-3.74L14 5.5v-1l.62-.14A5 5 0 0 0 18.36.62L18.5 0h1zM11 19a8 8 0 0 0 7.94-7h2.01c-.2 2.01-1 3.85-2.2 5.33l4.46 4.47-1.41 1.41-4.47-4.47a10 10 0 1 1-2.25-16.88l-3 1.21Q11.53 3 11 3a8 8 0 1 0 0 16"/>
                        </svg>
                        <span class="detail-page__media-btn-text">Search image</span>
                    </button>
                </div>

                <span class="detail-page__ai-label" hidden>AI modified</span>
            </div>
        </div>

        <div class="detail-page__info">
            <div class="detail-page__actions">
                <div class="detail-page__actions-left">
                    <button class="icon-btn icon-btn--48 detail-page__react" type="button" aria-label="React" aria-pressed="false">
                        <svg class="detail-page__react-outline" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                            <path d="M14.1 5.6A4.47 4.47 0 0 1 22 8.48V9c0 2.18-1.65 4.56-4.1 6.78a35 35 0 0 1-5.9 4.21 35 35 0 0 1-5.9-4.21C3.64 13.56 2 11.18 2 9v-.53a4.47 4.47 0 0 1 7.9-2.86L12 8.12zm-3.47-2.08A6.47 6.47 0 0 0 0 8.47V9c0 6.18 8.97 11.59 11.07 12.76q.43.24.93.24t.93-.24C15.03 20.6 24 15.18 24 9v-.53a6.47 6.47 0 0 0-11.44-4.14L12 5l-.56-.67q-.38-.45-.8-.81"/>
                        </svg>
                        <svg class="detail-page__react-fill" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                            <path d="M0 9c0 6.18 8.97 11.59 11.07 12.76q.43.24.93.24t.93-.24C15.03 20.6 24 15.18 24 9v-.53a6.47 6.47 0 0 0-11.44-4.14L12 5l-.56-.67A6.47 6.47 0 0 0 0 8.47z"/>
                        </svg>
                    </button>
                    <span class="detail-page__reactions"></span>

                    <button class="icon-btn icon-btn--48" type="button" aria-label="评论">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path d="m20.27 16.72.28-.58q.93-1.89.95-4.14a9.5 9.5 0 1 0-5.36 8.55l.58-.28 4.31.76zm-3.26 5.63A11.5 11.5 0 1 1 22.36 17l.64 3.7a2 2 0 0 1-2.3 2.3z"/></svg>
                    </button>
                    <button class="icon-btn icon-btn--48" type="button" aria-label="分享">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M17.7 5.8 12 .08l-5.7 5.7L7.7 7.2 11 3.9V15h2V3.91l3.3 3.3zM2 18v-5H0v5a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4v-5h-2v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2"/></svg>
                    </button>
                    <button class="icon-btn icon-btn--48" type="button" aria-label="更多">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M2.5 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5m9.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5m9.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5"/></svg>
                    </button>
                </div>
                <button class="btn btn--save" type="button">保存</button>
            </div>

            <div class="detail-page__scroll">
                <div class="detail-page__creator">
                    <a class="detail-page__creator-avatar" href="#" aria-label="创作者"></a>
                    <a class="detail-page__creator-name" href="#"></a>
                </div>

                <div class="detail-page__shop" hidden>
                    <a class="detail-page__shop-name" href="#" target="_blank" rel="noopener noreferrer"></a>
                    <svg class="detail-page__verified" viewBox="0 0 24 24" width="16" height="16" aria-label="已验证商家">
                        <path d="M12 24a12 12 0 1 0 0-24 12 12 0 0 0 0 24m-2-6.59-4.7-4.7 1.4-1.42 3.3 3.3 7.3-7.3 1.4 1.42z"/>
                    </svg>
                </div>

                <h1 class="detail-page__title"></h1>

                <div class="detail-page__price-row" hidden>
                    <span class="detail-page__price"></span>
                    <span class="detail-page__price-old"></span>
                </div>

                <div class="detail-page__rating" hidden>
                    <span class="detail-page__stars"></span>
                    <span class="detail-page__rating-score"></span>
                    <span class="detail-page__rating-count"></span>
                </div>

                <div class="detail-page__desc">
                    <h4 class="detail-page__desc-title">Description</h4>
                    <p class="detail-page__desc-text is-clamped"></p>
                    <button class="detail-page__desc-more" type="button">See more</button>
                </div>

                <div class="detail-page__comments">
                    <button class="detail-page__comments-toggle" type="button" aria-expanded="true">
                        <span class="detail-page__comments-title">0 Comments</span>
                        <svg class="detail-page__comments-caret" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                            <path d="M23.7 8.7 12 20.42.3 8.71l1.4-1.42L12 17.6 22.3 7.3z"/>
                        </svg>
                    </button>
                    <div class="detail-page__comments-list"></div>
                </div>
            </div>

            <div class="detail-page__composer">
                <div class="detail-page__composer-box">
                    <div class="detail-page__composer-input" contenteditable="true" role="textbox" aria-label="Add a comment to share your thoughts"></div>
                    <div class="detail-page__composer-actions">
                        <button class="icon-btn icon-btn--32" type="button" aria-label="Select an emoji">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M7 8.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m10 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.64 4.27A8.8 8.8 0 0 1 12 15c-2 0-3.91-.8-5.64-2.23l1.28-1.54A6.8 6.8 0 0 0 12 13q2.18.02 4.36-1.77zM24 12a12 12 0 1 1-24 0 12 12 0 0 1 24 0M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20"/></svg>
                        </button>
                        <button class="icon-btn icon-btn--32" type="button" aria-label="Select a sticker">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 1a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h5v-2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-4a4 4 0 0 0-3.7 2.5 4.5 4.5 0 0 1-3.48-1.91l-1.64 1.15A6.5 6.5 0 0 0 12 16.48V23h.76a4 4 0 0 0 2.83-1.17l6.24-6.24A4 4 0 0 0 23 12.76V5a4 4 0 0 0-4-4zm15.41 13.17-6.24 6.24-.17.16V16c0-1.1.9-2 2-2h4.57zM7.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m9-3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/></svg>
                        </button>
                        <button class="icon-btn icon-btn--32" type="button" aria-label="Select a photo">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M18 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0M5 1a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4zm16 4v9h-4.17a5.8 5.8 0 0 1-4.12-1.7l-.24-.24A7.04 7.04 0 0 0 3 11.63V5c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2M3 19v-4.59l.94-.94a5.04 5.04 0 0 1 7.12 0l.23.24A7.8 7.8 0 0 0 16.83 16H21v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2"/></svg>
                        </button>
                        <button class="icon-btn detail-page__composer-submit" type="button" aria-label="Post" hidden>
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path d="M4.07 1.37a2.1 2.1 0 0 0-2.8 2.59L3.94 12l-2.69 8.04a2.1 2.1 0 0 0 2.81 2.6l18.1-7.7A3 3 0 0 0 24 12.18v-.36a3 3 0 0 0-1.83-2.76zm-.89 1.86a.1.1 0 0 1 .1-.02l18.11 7.7a1 1 0 0 1 .61.91v.36a1 1 0 0 1-.6.92L3.28 20.8a.1.1 0 0 1-.13-.12L5.72 13H14v-2H5.72L3.16 3.33a.1.1 0 0 1 .02-.1"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

export function DetailPage() {
    const root = document.createElement('div');
    root.className = 'main-content detail-page';
    root.hidden = true;

    root.innerHTML = `
        <button class="detail-page__back" type="button" aria-label="返回">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path d="m4.41 13 6.3 6.3-1.42 1.4L.6 12l8.7-8.7 1.42 1.4L4.4 11H24v2z"/>
            </svg>
        </button>
        <div class="detail-page__grid"></div>
    `;

    const backBtn = root.querySelector('.detail-page__back');
    const gridContainer = root.querySelector('.detail-page__grid');

    let gridInstance = null;
    let loadMoreFn = null;
    let scrollHandler = null;
    let mediaViewer = null;

    function renderStars(rating) {
        const full = Math.round(rating);
        return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
    }

    function onMediaViewerKey(e) {
        if (e.key === 'Escape') closeMediaViewer();
    }

    function openMediaViewer(src, alt) {
        closeMediaViewer();

        const MIN_SCALE = 1;
        const MAX_SCALE = 3;
        const STEP = 0.5;
        let scale = 1;

        mediaViewer = document.createElement('div');
        mediaViewer.className = 'media-viewer';
        mediaViewer.setAttribute('role', 'dialog');
        mediaViewer.setAttribute('aria-modal', 'true');
        mediaViewer.setAttribute('aria-label', 'Media Viewer');

        mediaViewer.innerHTML = `
            <div class="media-viewer__backdrop"></div>
            <button class="media-viewer__close" type="button" aria-label="Close">
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                    <path d="m12 13.41 8.3 8.3 1.4-1.42L13.42 12l8.3-8.3-1.42-1.4-8.3 8.28-8.3-8.3L2.3 3.7l8.28 8.3-8.3 8.3 1.42 1.4z"/>
                </svg>
            </button>
            <div class="media-viewer__stage">
                <img class="media-viewer__img" src="${src}" alt="${alt ?? ''}" draggable="false">
            </div>
            <div class="media-viewer__zoom">
                <button class="media-viewer__zoom-btn" type="button" data-zoom="in" aria-label="Zoom in">
                    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                        <path d="M11 13v10h2V13h10v-2H13V1h-2v10H1v2z"/>
                    </svg>
                </button>
                <button class="media-viewer__zoom-btn" type="button" data-zoom="out" aria-label="Zoom out" disabled>
                    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                        <path d="M24 13H0v-2h24z"/>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(mediaViewer);

        const imgEl = mediaViewer.querySelector('.media-viewer__img');
        const zoomInBtn = mediaViewer.querySelector('[data-zoom="in"]');
        const zoomOutBtn = mediaViewer.querySelector('[data-zoom="out"]');

        function applyScale() {
            imgEl.style.transform = `scale(${scale})`;
            zoomOutBtn.disabled = scale <= MIN_SCALE + 1e-6;
            zoomInBtn.disabled = scale >= MAX_SCALE - 1e-6;
        }

        zoomInBtn.addEventListener('click', () => {
            scale = Math.min(MAX_SCALE, scale + STEP);
            applyScale();
        });
        zoomOutBtn.addEventListener('click', () => {
            scale = Math.max(MIN_SCALE, scale - STEP);
            applyScale();
        });

        applyScale();

        mediaViewer.querySelector('.media-viewer__backdrop')
            .addEventListener('click', closeMediaViewer);
        mediaViewer.querySelector('.media-viewer__close')
            .addEventListener('click', closeMediaViewer);
        document.addEventListener('keydown', onMediaViewerKey);

        requestAnimationFrame(() => mediaViewer.classList.add('is-open'));
    }

    function closeMediaViewer() {
        if (!mediaViewer) return;
        document.removeEventListener('keydown', onMediaViewerKey);

        const el = mediaViewer;
        mediaViewer = null;
        el.classList.remove('is-open');
        setTimeout(() => el.remove(), 220);
    }

    function populatePanel(panel, pin) {
        const $ = sel => panel.querySelector(sel);

        const img = $('.detail-page__img');
        const imageWrap = $('.detail-page__image-wrap');
        const aiLabel = $('.detail-page__ai-label');
        const reactions = $('.detail-page__reactions');
        const reactBtn = $('.detail-page__react');
        const saveBtn = $('.btn--save');
        const creatorAvatar = $('.detail-page__creator-avatar');
        const creatorName = $('.detail-page__creator-name');
        const shopName = $('.detail-page__shop-name');
        const shopRow = $('.detail-page__shop');
        const titleEl = $('.detail-page__title');
        const priceEl = $('.detail-page__price');
        const priceOldEl = $('.detail-page__price-old');
        const ratingRow = $('.detail-page__rating');
        const starsEl = $('.detail-page__stars');
        const scoreEl = $('.detail-page__rating-score');
        const countEl = $('.detail-page__rating-count');
        const descEl = $('.detail-page__desc-text');
        const descMore = $('.detail-page__desc-more');
        const commentsToggle = $('.detail-page__comments-toggle');
        const commentsTitle = $('.detail-page__comments-title');
        const commentsList = $('.detail-page__comments-list');
        const viewLargerBtn = $('.detail-page__overlay-layers button[aria-label="View larger"]');

        const composerInput = $('.detail-page__composer-input');
        const composerSubmit = $('.detail-page__composer-submit');

        img.src = pin.image;
        img.alt = pin.title ?? '';

        if (pin.width && pin.height) {
            imageWrap.style.setProperty('--pin-ratio', `${pin.width} / ${pin.height}`);
        } else {
            imageWrap.style.removeProperty('--pin-ratio');
        }

        imageWrap.style.background = pin.dominantColor ?? '#f1f1f1';
        aiLabel.hidden = !pin.aiModified;

        /* ---------- React（点赞）：纯前端计数，不写数据库 ---------- */
        function formatCount(n) {
            if (n >= 1000) {
                const k = n / 1000;
                return (k >= 10 ? Math.round(k) : k.toFixed(1)).replace(/\.0$/, '') + 'k';
            }
            return String(n);
        }

        const baseReactions = Number(pin.reactions ?? 0);
        let reacted = false;

        function refreshReact() {
            reactBtn.setAttribute('aria-pressed', String(reacted));
            reactBtn.classList.toggle('is-reacted', reacted);
            reactions.textContent = formatCount(baseReactions + (reacted ? 1 : 0));
        }
        refreshReact();

        reactBtn.addEventListener('click', () => {
            reacted = !reacted;
            refreshReact();
        });

        /* ---------- Save（保存）：写数据库，显示在 /boards ---------- */
        let saved = false;
        let saving = false;

        function refreshSave() {
            saveBtn.textContent = saved ? '已保存' : '保存';
            saveBtn.classList.toggle('is-saved', saved);
        }
        refreshSave();

        async function toggleSave() {
            if (saving) return;
            if (!getCurrentUser()) {
                root.dispatchEvent(new CustomEvent('need-login', { bubbles: true }));
                return;
            }

            saving = true;
            try {
                if (saved) {
                    await savesApi.unsave(pin.id);
                    saved = false;
                } else {
                    await savesApi.save(pin.id);
                    saved = true;
                }
                refreshSave();
            } catch (err) {
                alert(err.message || '操作失败');
            } finally {
                saving = false;
            }
        }

        saveBtn.addEventListener('click', toggleSave);

        // 查初始状态
        if (getCurrentUser()) {
            savesApi.listMySaves().then(({ pinIds }) => {
                if (pinIds.includes(pin.id)) {
                    saved = true;
                    refreshSave();
                }
            }).catch(() => { });
        }

        if (pin.creator) {
            creatorAvatar.textContent = pin.creator[0].toUpperCase();
            creatorName.textContent = pin.creator;
            creatorName.href = pin.creatorUrl ?? '#';
            creatorAvatar.href = pin.creatorUrl ?? '#';
        }

        if (pin.shop) {
            shopName.textContent = pin.shop;
            shopName.href = pin.shopUrl ?? '#';
            shopRow.hidden = false;
        } else {
            shopRow.hidden = true;
        }

        titleEl.textContent = pin.title ?? '';

        if (pin.price != null) {
            priceEl.textContent = `$${pin.price.toFixed(2)}`;
            priceEl.parentElement.hidden = false;
        } else {
            priceEl.parentElement.hidden = true;
        }
        if (pin.oldPrice != null) {
            priceOldEl.textContent = `$${pin.oldPrice.toFixed(2)}`;
            priceOldEl.hidden = false;
        } else {
            priceOldEl.hidden = true;
        }

        if (pin.rating != null) {
            starsEl.textContent = renderStars(pin.rating);
            scoreEl.textContent = pin.rating.toFixed(1);
            countEl.textContent = pin.ratingCount ? `(${pin.ratingCount})` : '';
            ratingRow.hidden = false;
        } else {
            ratingRow.hidden = true;
        }

        descEl.textContent = pin.description ?? '';
        descEl.classList.add('is-clamped');
        descMore.textContent = 'See more';
        descMore.hidden = !pin.description;

        /* ---------- 评论 ---------- */
        let comments = [];

        function closeAllCommentMenus() {
            panel.querySelectorAll('.detail-page__comment-menu').forEach(m => {
                m.hidden = true;
            });
            panel.querySelectorAll('.detail-page__comment-more').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
            });
        }

        function refreshCommentsTitle() {
            const n = comments.length;
            commentsTitle.textContent =
                n === 0 ? 'No comments yet'
                    : n === 1 ? '1 Comment'
                        : `${n} Comments`;
        }

        function buildCommentItem(c, { isNew = false } = {}) {
            const item = document.createElement('div');
            item.className = 'detail-page__comment' + (isNew ? ' detail-page__comment--new' : '');
            item.dataset.id = c.id;

            const avatar = document.createElement('span');
            avatar.className = 'detail-page__comment-avatar';
            avatar.textContent = (c.author ?? '?')[0].toUpperCase();

            const body = document.createElement('p');
            body.className = 'detail-page__comment-body';

            const author = document.createElement('span');
            author.className = 'detail-page__comment-author';
            author.textContent = c.author ?? '';

            const textSpan = document.createElement('span');
            textSpan.className = 'detail-page__comment-text';
            textSpan.textContent = c.text ?? '';

            body.appendChild(author);
            body.appendChild(textSpan);

            item.appendChild(avatar);
            item.appendChild(body);

            const me = getCurrentUser();
            if (me && me.id === c.userId) {
                const wrap = document.createElement('div');
                wrap.className = 'detail-page__comment-menu-wrap';

                const moreBtn = document.createElement('button');
                moreBtn.type = 'button';
                moreBtn.className = 'detail-page__comment-more';
                moreBtn.setAttribute('aria-label', 'More options');
                moreBtn.setAttribute('aria-haspopup', 'true');
                moreBtn.setAttribute('aria-expanded', 'false');
                moreBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        <path d="M2.5 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5m9.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5m9.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5"/>
                    </svg>`;

                const menu = document.createElement('div');
                menu.className = 'detail-page__comment-menu';
                menu.setAttribute('role', 'menu');
                menu.hidden = true;

                const delBtn = document.createElement('button');
                delBtn.type = 'button';
                delBtn.className = 'detail-page__comment-menu-item';
                delBtn.setAttribute('role', 'menuitem');
                delBtn.textContent = 'Delete';
                delBtn.addEventListener('click', async () => {
                    menu.hidden = true;
                    moreBtn.setAttribute('aria-expanded', 'false');
                    try {
                        await commentsApi.remove(c.id);
                        comments = comments.filter(x => x.id !== c.id);
                        item.remove();
                        refreshCommentsTitle();
                    } catch (err) {
                        alert(err.message || '删除失败');
                    }
                });

                menu.appendChild(delBtn);

                moreBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isOpen = !menu.hidden;
                    closeAllCommentMenus();
                    if (!isOpen) {
                        menu.hidden = false;
                        moreBtn.setAttribute('aria-expanded', 'true');
                    }
                });

                wrap.appendChild(moreBtn);
                wrap.appendChild(menu);
                item.appendChild(wrap);
            }

            return item;
        }

        function renderComments() {
            commentsList.innerHTML = '';
            const expanded = commentsToggle.getAttribute('aria-expanded') === 'true';
            commentsList.hidden = !expanded;
            comments.forEach(c => commentsList.appendChild(buildCommentItem(c)));
            refreshCommentsTitle();
        }

        commentsToggle.setAttribute('aria-expanded', 'true');
        commentsToggle.classList.remove('is-collapsed');
        commentsList.innerHTML = '<p class="detail-page__comments-empty">加载中…</p>';

        commentsApi.list(pin.id)
            .then(({ comments: list }) => {
                comments = list || [];
                renderComments();
            })
            .catch(err => {
                console.error('加载评论失败:', err);
                comments = [];
                commentsList.innerHTML = '<p class="detail-page__comments-empty">评论加载失败</p>';
                refreshCommentsTitle();
            });

        // 点击面板空白区域关闭评论菜单
        panel.addEventListener('click', (e) => {
            if (e.target.closest('.detail-page__comment-menu-wrap')) return;
            closeAllCommentMenus();
        });

        if (viewLargerBtn) {
            viewLargerBtn.addEventListener('click', () => {
                openMediaViewer(pin.image, pin.title);
            });
        }

        descMore.addEventListener('click', () => {
            const clamped = descEl.classList.toggle('is-clamped');
            descMore.textContent = clamped ? 'See more' : 'See less';
        });

        commentsToggle.addEventListener('click', () => {
            const expanded = commentsToggle.getAttribute('aria-expanded') === 'true';
            const next = !expanded;
            commentsToggle.setAttribute('aria-expanded', String(next));
            commentsList.hidden = !next;
            commentsToggle.classList.toggle('is-collapsed', !next);
        });

        /* ---------- Composer ---------- */
        function refreshSubmit() {
            const text = (composerInput.textContent ?? '').replace(/\u00a0/g, ' ').trim();
            composerSubmit.hidden = text.length === 0;
        }

        async function submitComment() {
            const text = (composerInput.textContent ?? '').replace(/\u00a0/g, ' ').trim();
            if (!text) return;

            const me = getCurrentUser();
            if (!me) {
                root.dispatchEvent(new CustomEvent('need-login', { bubbles: true }));
                return;
            }

            composerSubmit.disabled = true;
            try {
                const { comment } = await commentsApi.create(pin.id, text);
                comments.push(comment);

                commentsToggle.setAttribute('aria-expanded', 'true');
                commentsToggle.classList.remove('is-collapsed');
                commentsList.hidden = false;

                const emptyHint = commentsList.querySelector('.detail-page__comments-empty');
                if (emptyHint) emptyHint.remove();

                const item = buildCommentItem(comment, { isNew: true });
                commentsList.appendChild(item);
                refreshCommentsTitle();
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                composerInput.textContent = '';
                refreshSubmit();
            } catch (err) {
                alert(err.message || '发送失败');
            } finally {
                composerSubmit.disabled = false;
                composerInput.focus();
            }
        }

        composerInput.addEventListener('input', refreshSubmit);
        composerInput.addEventListener('paste', () => setTimeout(refreshSubmit, 0));
        composerSubmit.addEventListener('click', submitComment);
        composerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitComment();
            }
        });

        refreshSubmit();
    }

    function cleanupInfiniteScroll() {
        if (scrollHandler) {
            window.removeEventListener('scroll', scrollHandler);
            scrollHandler = null;
        }
        loadMoreFn = null;
    }

    function setupInfiniteScroll() {
        if (!loadMoreFn) return;

        let ticking = false;

        const check = () => {
            if (!gridInstance) return;
            const rect = gridInstance.getBoundingClientRect();
            if (rect.bottom < window.innerHeight + 800) {
                const more = loadMoreFn();
                if (more && more.length) {
                    gridInstance.appendItems(more);
                }
            }
        };

        scrollHandler = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;
                check();
            });
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });

        requestAnimationFrame(() => {
            check();
            requestAnimationFrame(check);
        });
    }

    function mountGrid(pin, relatedItems, loadMore) {
        cleanupInfiniteScroll();

        if (gridInstance) {
            gridInstance.destroy();
            gridInstance = null;
        }
        gridContainer.innerHTML = '';

        loadMoreFn = loadMore ?? null;

        requestAnimationFrame(() => {
            const tmp = document.createElement('div');
            tmp.innerHTML = PANEL_HTML.trim();
            const panel = tmp.firstElementChild;

            panel.style.height = 'min(720px, calc(100vh - 160px))';

            populatePanel(panel, pin);

            gridInstance = PinGrid({
                items: relatedItems ?? [],
                hero: { element: panel, columns: 4 },
                desiredColumns: 6,
                buffer: 800
            });
            gridContainer.appendChild(gridInstance);

            setupInfiniteScroll();
        });
    }

    function open(pin, relatedItems = [], loadMore = null) {
        mountGrid(pin, relatedItems, loadMore);
        root.hidden = false;
    }

    function close() {
        root.hidden = true;
        cleanupInfiniteScroll();
        closeMediaViewer();
        if (gridInstance) {
            gridInstance.destroy();
            gridInstance = null;
        }
    }

    backBtn.addEventListener('click', () => {
        root.dispatchEvent(new CustomEvent('detail-close', { bubbles: true }));
    });

    root.open = open;
    root.close = close;
    return root;
}