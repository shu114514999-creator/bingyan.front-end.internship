import { PinCard } from './PinCard.js';

export function PinGrid({ items, minColumnWidth = 236, gap = 16 }) {
    const root = document.createElement('div');
    root.className = 'pin-grid';

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

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(layout, 120);
    });

    track.querySelectorAll('img').forEach(img => {
        if (!img.complete) {
            img.addEventListener('load', () => requestAnimationFrame(layout), { once: true });
        }
    });

    root.appendItems = (newItems) => {
        newItems.forEach(data => {
            const card = PinCard(data);
            cardEls.push(card);
            track.appendChild(card);
        });
        layout();
    };

    return root;
}