import './styles/main.scss';
import { Sidebar } from './components/Sidebar.js';
import { Topbar } from './components/Topbar.js';
import { FilterBar } from './components/FilterBar.js';
import { PinGrid } from './components/PinGrid.js';
import { DetailPage } from './components/DetailPage.js';
import { Panels } from './components/Panels.js';
import { mockPins } from './data/mockPins.js';
import { AccountMenu } from './components/AccountMenu.js';

const app = document.getElementById('app');

/* ============ 路由表 ============ */
const NAV_PATHS = {
    home: '/',
    explore: '/ideas',
    boards: '/boards'
};

let lastListViewPath = '/';

/* ============ 数据池 ============ */
const pinMap = new Map();
mockPins.forEach(p => pinMap.set(Number(p.id), p));
let nextId = mockPins.length + 1;

/**
 * 生成一批新的 pin（id 递增，图复用，走浏览器缓存 → 秒加载）
 * 供主网格和详情页共用
 */
function createMorePins(count = 30) {
    const batch = [];
    for (let i = 0; i < count; i++) {
        const base = mockPins[Math.floor(Math.random() * mockPins.length)];
        const id = nextId++;
        const copy = { ...base, id };
        pinMap.set(id, copy);
        batch.push(copy);
    }
    return batch;
}

/* ============ 面板 ============ */
const panels = Panels();
app.appendChild(panels);

function syncNav() {
    const key = Object.keys(NAV_PATHS)
        .find(k => NAV_PATHS[k] === location.pathname) ?? 'home';
    panels.setActive(document.querySelector(`.nav-item[data-key="${key}"]`));
}
panels.addEventListener('panel-close', syncNav);

/* ============ 账号菜单 ============ */
const accountMenu = AccountMenu();
app.appendChild(accountMenu);

/* ============ 侧栏 ============ */
app.appendChild(Sidebar({
    onNavigate: (key, el) => {
        panels.close();
        const path = NAV_PATHS[key] ?? '/';
        if (path === location.pathname) {
            syncNav();
            return;
        }
        navigate(path);
    },
    onOpenPanel: (key, anchor) => panels.open(key, anchor)
}));

/* ============ 顶栏 ============ */
app.appendChild(Topbar({
    onSearch: (q) => console.log('搜索:', q),
    onOpenAccount: (anchor) => accountMenu.open(anchor)
}));

/* ============ 主页视图 ============ */
const main = document.createElement('main');
main.className = 'main-content home-view';

main.appendChild(FilterBar({
    items: ['全部', '时尚', '家居', '美食', '旅行', '婚礼', '艺术', '健身'],
    onChange: (label) => console.log('切换分类:', label)
}));

const grid = PinGrid({ items: mockPins });
main.appendChild(grid);

/* ---------- 主网格无限滚动 ---------- */
const sentinel = document.createElement('div');
sentinel.style.height = '1px';
main.appendChild(sentinel);

let loading = false;

function loadMoreMain() {
    if (loading) return;
    loading = true;

    const batch = createMorePins(mockPins.length);

    setTimeout(() => {
        grid.appendItems(batch);
        loading = false;
        scheduleMainCheck();
    }, 120);
}

let rafMain = null;
function scheduleMainCheck() {
    if (rafMain) return;
    rafMain = requestAnimationFrame(() => {
        rafMain = null;
        const rect = sentinel.getBoundingClientRect();
        if (rect.top < window.innerHeight + 600) loadMoreMain();
    });
}

window.addEventListener('scroll', scheduleMainCheck, { passive: true });
scheduleMainCheck();

app.appendChild(main);

/* ============ 详情页视图 ============ */
const detailPage = DetailPage();
app.appendChild(detailPage);

detailPage.addEventListener('detail-close', () => {
    if (history.length > 1) history.back();
    else navigate(lastListViewPath);
});

/* ============ 路由 ============ */
function route(path) {
    const m = path.match(/^\/pin\/([^/?#]+)\/?$/);

    if (m) {
        const pin = pinMap.get(Number(m[1]));
        if (pin) {
            const related = [...pinMap.values()]
                .filter(p => p.id !== pin.id)
                .sort(() => Math.random() - 0.5)
                .slice(0, 30);

            // ★ 传第三参：加载更多的回调
            detailPage.open(pin, related, () => createMorePins(30));
            main.hidden = true;
            window.scrollTo(0, 0);
            return;
        }
        history.replaceState(null, '', '/');
        path = '/';
    }

    lastListViewPath = path;
    detailPage.close();
    main.hidden = false;
    syncNav();
}

function navigate(path) {
    if (path === location.pathname) return;
    if (!/^\/pin\//.test(path)) lastListViewPath = path;
    history.pushState(null, '', path);
    route(path);
}

window.addEventListener('popstate', () => route(location.pathname));

/* ============ 全局拦截卡片点击 ============ */
app.addEventListener('click', (e) => {
    if (e.target.closest('.pin-card__overlay button, .pin-card__overlay a')) return;

    const card = e.target.closest('.pin-card');
    if (!card) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    e.preventDefault();
    navigate(`/pin/${card.dataset.id}`);
});

/* ============ 启动 ============ */
route(location.pathname);