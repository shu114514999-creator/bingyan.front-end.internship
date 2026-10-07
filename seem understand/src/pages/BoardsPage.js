import { PinGrid } from '../components/PinGrid.js';
import { savesApi } from '../api/saves.js';
import { pinsApi } from '../api/pins.js';

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
            <button class="boards-page__tab is-active" type="button" data-tab="pins">Pins</button>
            <button class="boards-page__tab" type="button" data-tab="saved">Saved</button>
        </div>

        <div class="boards-page__grid"></div>

        <div class="boards-page__empty" hidden>
            <img class="boards-page__empty-illus"
                 src="https://s.pinimg.com/gestalt/illustrations/v1/ill.pinboard.spot.light.svg.webp"
                 alt="" loading="lazy">
            <h2 class="boards-page__empty-title"></h2>
            <p class="boards-page__empty-desc"></p>
        </div>
    `;

    const avatarEl = root.querySelector('.boards-page__avatar');
    const nameEl = root.querySelector('.boards-page__name');
    const statsEl = root.querySelector('.boards-page__stats');
    const tabsEl = root.querySelector('.boards-page__tabs');
    const gridEl = root.querySelector('.boards-page__grid');
    const emptyEl = root.querySelector('.boards-page__empty');
    const emptyTitleEl = root.querySelector('.boards-page__empty-title');
    const emptyDescEl = root.querySelector('.boards-page__empty-desc');

    let gridInstance = null;
    let currentUser = null;
    let currentTab = 'pins';
    const cache = { pins: null, saved: null };

    function destroyGrid() {
        if (gridInstance) {
            gridInstance.destroy?.();
            gridInstance = null;
        }
        gridEl.innerHTML = '';
    }

    function renderEmpty() {
        emptyEl.hidden = false;
        gridEl.hidden = true;

        if (currentTab === 'pins') {
            emptyTitleEl.textContent = '还没有上传过 Pin';
            emptyDescEl.textContent = '点击侧栏的"创建"上传第一张 Pin';
        } else {
            emptyTitleEl.textContent = '还没有保存的 Pin';
            emptyDescEl.textContent = '去首页找找灵感，点击图片详情里的 ❤️ 保存你喜欢的图片';
        }
    }

    function renderGrid(items) {
        emptyEl.hidden = true;
        gridEl.hidden = false;

        destroyGrid();
        requestAnimationFrame(() => {
            gridInstance = PinGrid({
                items,
                desiredColumns: 6,
                buffer: 600
            });
            gridEl.appendChild(gridInstance);
        });
    }

    function updateHeader() {
        if (!currentUser) return;
        avatarEl.textContent = (currentUser.username ?? '?')[0].toUpperCase();
        nameEl.textContent = currentUser.username ?? '';

        const pinsCount = cache.pins?.length ?? 0;
        const savedCount = cache.saved?.length ?? 0;

        if (currentTab === 'pins') {
            statsEl.textContent = `${pinsCount} ${pinsCount === 1 ? 'Pin' : 'Pins'}`;
        } else {
            statsEl.textContent = `${savedCount} saved`;
        }
    }

    async function loadTab(tab) {
        currentTab = tab;
        tabsEl.querySelectorAll('.boards-page__tab').forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.tab === tab);
        });

        if (!currentUser) return;

        // 命中缓存
        if (cache[tab]) {
            updateHeader();
            cache[tab].length === 0 ? renderEmpty() : renderGrid(cache[tab]);
            return;
        }

        // 加载中
        destroyGrid();
        gridEl.innerHTML = '<p class="boards-page__loading">加载中…</p>';
        emptyEl.hidden = true;
        gridEl.hidden = false;

        try {
            let items = [];
            if (tab === 'pins') {
                const { pins } = await pinsApi.listUser(currentUser.username);
                items = pins.map(p => ({
                    ...p,
                    dominantColor: '#f1f1f1',
                    reactions: 0,
                    comments: []
                }));
            } else {
                const { pinIds } = await savesApi.listUserSaves(currentUser.username);
                // 需要把这些 pin 从后端拿到 —— 但 saves 表里只有 pin_id
                // 复用 pins 接口来拼（可能有些是 mock 的 pin，无对应）
                const { pins: myUploads } = await pinsApi.listUser(currentUser.username);
                const pinMapLocal = new Map(myUploads.map(p => [p.id, p]));
                items = pinIds
                    .map(id => pinMapLocal.get(id))
                    .filter(Boolean)
                    .map(p => ({
                        ...p,
                        dominantColor: '#f1f1f1',
                        reactions: 0,
                        comments: []
                    }));
            }

            cache[tab] = items;
            updateHeader();
            items.length === 0 ? renderEmpty() : renderGrid(items);
        } catch (err) {
            console.error(err);
            destroyGrid();
            gridEl.innerHTML = '<p class="boards-page__loading">加载失败</p>';
        }
    }

    tabsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.boards-page__tab');
        if (!btn) return;
        loadTab(btn.dataset.tab);
    });

    function open(user) {
        currentUser = user;
        cache.pins = null;
        cache.saved = null;
        currentTab = 'pins';
        root.hidden = false;
        loadTab('pins');
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