import { PinCard } from './PinCard.js';

export function PinGrid({
    items,
    minColumnWidth = 236,
    gap = 16,
    buffer = 600,
    hero = null,              // { element: HTMLElement, columns: number }
    desiredColumns = 0        // 优先的列数（0 = 按 minColumnWidth 自动）
} = {}) {
    const root = document.createElement('div');
    root.className = 'pin-grid';

    const track = document.createElement('div');
    track.className = 'pin-grid__track';
    root.appendChild(track);

    const allItems = [...items];
    let positions = [];
    let columnCards = [];
    let columns = 0;
    let columnWidth = 0;
    let columnHeights = [];
    let totalHeight = 0;

    const mounted = new Map();
    const pool = [];

    const heroEl = hero?.element ?? null;
    const heroColsRequested = hero?.columns ?? 4;
    let heroHeight = 0;

    if (heroEl) {
        heroEl.classList.add('pin-grid__hero');
        heroEl.style.position = 'absolute';
        heroEl.style.top = '0';
        heroEl.style.left = '0';
        track.appendChild(heroEl);
    }

    /* ---------------- 列数计算 ---------------- */
    function ensureColumns() {
        const w = root.clientWidth;
        if (w <= 0) return false;

        let cols;
        if (desiredColumns > 0) {
            const ABSOLUTE_MIN = 200;
            const maxPossible = Math.max(1, Math.floor((w + gap) / (ABSOLUTE_MIN + gap)));
            cols = Math.min(desiredColumns, maxPossible);
        } else {
            cols = Math.max(1, Math.floor((w + gap) / (minColumnWidth + gap)));
        }
        const colW = (w - gap * (cols - 1)) / cols;

        if (cols === columns && colW === columnWidth) return false;
        columns = cols;
        columnWidth = colW;
        return true;
    }

    /* ---------------- 布局计算 ---------------- */
    function placeInLayout(item, index) {
        let shortest = 0;
        for (let c = 1; c < columns; c++) {
            if (columnHeights[c] < columnHeights[shortest]) shortest = c;
        }
        const ratio = (item.height ?? 4) / (item.width ?? 3);
        const w = columnWidth;
        const h = columnWidth * ratio;
        const x = shortest * (columnWidth + gap);
        const y = columnHeights[shortest];

        positions[index] = { x, y, w, h };
        columnCards[shortest].push(index);
        columnHeights[shortest] = y + h + gap;
    }

    function updateTrackHeight() {
        totalHeight = Math.max(0, Math.max(...columnHeights, 0) - gap);
        track.style.height = `${totalHeight}px`;
    }

    function fullLayout() {
        if (root.clientWidth <= 0) return;
        ensureColumns();

        columnHeights = new Array(columns).fill(0);
        positions = new Array(allItems.length);
        columnCards = Array.from({ length: columns }, () => []);

        // Hero 占位
        if (heroEl) {
            const cols = Math.min(heroColsRequested, columns);
            const heroW = cols * columnWidth + (cols - 1) * gap;
            heroEl.style.width = `${heroW}px`;
            heroEl.style.transform = 'translate(0px, 0px)';
            heroHeight = heroEl.offsetHeight;

            for (let c = 0; c < cols; c++) {
                columnHeights[c] = heroHeight + gap;
            }
        }

        allItems.forEach((item, i) => placeInLayout(item, i));
        updateTrackHeight();
    }

    /* ---------------- 挂载 / 卸载 ---------------- */
    function acquireCard(item) {
        const card = pool.pop();
        if (card) card.reset();
        return card ?? PinCard(item);
    }

    function releaseCard(card) {
        card.remove();
        pool.push(card);
        if (pool.length > 40) pool.shift();
    }

    function mountCard(index) {
        if (mounted.has(index)) return;
        const item = allItems[index];
        const pos = positions[index];

        const card = acquireCard(item);
        card.style.width = `${pos.w}px`;
        card.style.transform = `translate(${pos.x}px, ${pos.y}px)`;

        track.appendChild(card);
        mounted.set(index, card);
        card.hydrate(item);
    }

    function unmountCard(index) {
        const card = mounted.get(index);
        if (!card) return;
        mounted.delete(index);
        releaseCard(card);
    }

    /* ---------------- 视口同步 ---------------- */
    function syncVisible() {
        if (positions.length === 0 || columns === 0) return;

        const rect = root.getBoundingClientRect();
        const viewTop = -rect.top - buffer;
        const viewBottom = -rect.top + window.innerHeight + buffer;

        const visible = new Set();

        for (let c = 0; c < columns; c++) {
            const list = columnCards[c];
            if (!list || list.length === 0) continue;

            let lo = 0, hi = list.length;
            while (lo < hi) {
                const mid = (lo + hi) >> 1;
                const p = positions[list[mid]];
                if (p.y + p.h < viewTop) lo = mid + 1;
                else hi = mid;
            }
            for (let k = lo; k < list.length; k++) {
                const idx = list[k];
                const p = positions[idx];
                if (p.y > viewBottom) break;
                visible.add(idx);
            }
        }

        for (const idx of [...mounted.keys()]) {
            if (!visible.has(idx)) unmountCard(idx);
        }
        for (const idx of visible) {
            if (!mounted.has(idx)) mountCard(idx);
        }
    }

    let raf = null;
    function scheduleSync() {
        if (raf) return;
        raf = requestAnimationFrame(() => {
            raf = null;
            syncVisible();
        });
    }

    function relayout() {
        for (const idx of [...mounted.keys()]) unmountCard(idx);
        fullLayout();
        syncVisible();
    }

    /* ---------------- 绑定 ---------------- */
    requestAnimationFrame(relayout);

    let ro = null;
    if ('ResizeObserver' in window) {
        ro = new ResizeObserver(() => relayout());
        ro.observe(root);
    }

    window.addEventListener('scroll', scheduleSync, { passive: true });

    root.appendItems = (newItems) => {
        if (columns === 0) {
            allItems.push(...newItems);
            return;
        }
        const start = allItems.length;
        newItems.forEach((item, k) => {
            const idx = start + k;
            allItems.push(item);
            placeInLayout(item, idx);
        });
        updateTrackHeight();
        scheduleSync();
    };

    root.destroy = () => {
        window.removeEventListener('scroll', scheduleSync);
        if (ro) ro.disconnect();
        if (raf) cancelAnimationFrame(raf);
        mounted.forEach(card => card.remove());
        mounted.clear();
        pool.length = 0;
        root.remove();
    };

    root.mountedCount = () => mounted.size;

    return root;
}