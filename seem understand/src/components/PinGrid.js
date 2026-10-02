import { PinCard } from './PinCard.js';

export function PinGrid({ items, minColumnWidth = 236, gap = 16, onPinOpen } = {}) {
    const root = document.createElement('div');
    root.className = 'pin-grid';

    root.addEventListener('pin:open', (e) => {
        onPinOpen?.(e.detail.pin);
    });

    const track = document.createElement('div');
    track.className = 'pin-grid__track';
    root.appendChild(track);

    let columns = 0;
    let columnWidth = 0;
    let columnHeights = [];

    const cardEls = items.map(data => PinCard(data));
    cardEls.forEach(card => track.appendChild(card));

    function layout() {
        const containerWidth = root.clientWidth;
        if (containerWidth <= 0) return;

        columns = Math.max(1, Math.floor((containerWidth + gap) / (minColumnWidth + gap)));
        columnWidth = (containerWidth - gap * (columns - 1)) / columns;
        columnHeights = new Array(columns).fill(0);

        cardEls.forEach(card => {
            let shortestCol = 0;
            for (let i = 1; i < columns; i++) {
                if (columnHeights[i] < columnHeights[shortestCol]) shortestCol = i;
            }

            const x = shortestCol * (columnWidth + gap);
            const y = columnHeights[shortestCol];

            card.style.width = `${columnWidth}px`;
            card.style.transform = `translate(${x}px, ${y}px)`;

            columnHeights[shortestCol] = y + card.offsetHeight + gap;
        });

        const maxHeight = Math.max(...columnHeights) - gap;
        track.style.height = `${Math.max(0, maxHeight)}px`;
    }

    requestAnimationFrame(layout);

    /* ---- 容器宽度变化就重排（面板推挤 / 窗口缩放都会触发） ---- */
    let rafId = null;
    const scheduleLayout = () => {
        if (rafId != null) return;
        rafId = requestAnimationFrame(() => {
            rafId = null;
            layout();
        });
    };

    const ro = new ResizeObserver(scheduleLayout);
    ro.observe(root);

    /* ---- 图片加载完 → 卡片高度变了，也要重排 ---- */
    function bindImageLoad(cards) {
        cards.forEach(card => {
            card.querySelectorAll('img').forEach(img => {
                if (img.complete) return;
                img.addEventListener('load', () => requestAnimationFrame(layout), { once: true });
            });
        });
    }
    bindImageLoad(cardEls);

    root.appendItems = (newItems) => {
        const newCards = newItems.map(data => PinCard(data));
        newCards.forEach(card => {
            cardEls.push(card);
            track.appendChild(card);
        });
        bindImageLoad(newCards);
        layout();
    };

    return root;
}