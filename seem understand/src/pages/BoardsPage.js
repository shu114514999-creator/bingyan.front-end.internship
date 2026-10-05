import { PinGrid } from '../components/PinGrid.js';

export function BoardsPage() {
    const root = document.createElement('div');
    root.className = 'main-content boards-page';
    root.hidden = true;

    root.innerHTML = `
        <div class="boards-page__header">
            <div class="boards-page__avatar"></div>
            <div class="boards-page__meta">
                <h1 class="boards-page__name"></h1>
                <p class="boards-page__stats"></p>
            </div>
        </div>

        <div class="boards-page__tabs">
            <button class="boards-page__tab is-active" type="button">Pins</button>
            <button class="boards-page__tab" type="button" disabled>Boards</button>
        </div>

        <div class="boards-page__grid"></div>

        <div class="boards-page__empty" hidden>
            <img class="boards-page__empty-illus"
                 src="https://s.pinimg.com/gestalt/illustrations/v1/ill.pinboard.spot.light.svg.webp"
                 alt="" loading="lazy">
            <h2 class="boards-page__empty-title">还没有保存的 Pin</h2>
            <p class="boards-page__empty-desc">
                去首页找找灵感，点击图片详情里的 ❤️ 保存你喜欢的图片
            </p>
        </div>
    `;

    const avatarEl = root.querySelector('.boards-page__avatar');
    const nameEl = root.querySelector('.boards-page__name');
    const statsEl = root.querySelector('.boards-page__stats');
    const gridEl = root.querySelector('.boards-page__grid');
    const emptyEl = root.querySelector('.boards-page__empty');

    let gridInstance = null;

    function destroyGrid() {
        if (gridInstance) {
            gridInstance.destroy?.();
            gridInstance = null;
        }
        gridEl.innerHTML = '';
    }

    function render(user, pins) {
        avatarEl.textContent = (user?.username ?? '?')[0].toUpperCase();
        nameEl.textContent = user?.username ?? '';
        const n = pins.length;
        statsEl.textContent = `${n} saved ${n === 1 ? 'Pin' : 'Pins'}`;

        destroyGrid();

        if (n === 0) {
            emptyEl.hidden = false;
            gridEl.hidden = true;
            return;
        }

        emptyEl.hidden = true;
        gridEl.hidden = false;

        requestAnimationFrame(() => {
            gridInstance = PinGrid({
                items: pins,
                desiredColumns: 6,
                buffer: 600
            });
            gridEl.appendChild(gridInstance);
        });
    }

    function open(user, pins) {
        render(user, pins);
        root.hidden = false;
        window.scrollTo(0, 0);
    }

    function close() {
        root.hidden = true;
        destroyGrid();
    }

    root.open = open;
    root.close = close;
    return root;
}