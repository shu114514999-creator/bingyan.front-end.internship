import './styles/main.scss';
import { Sidebar } from './components/Sidebar.js';
import { Topbar } from './components/Topbar.js';
import { FilterBar } from './components/FilterBar.js';
import { PinGrid } from './components/PinGrid.js';
import { DetailPage } from './components/DetailPage.js';
import { Panels } from './components/Panels.js';
import { mockPins } from './data/mockPins.js';
import { AccountMenu } from './components/AccountMenu.js';
import { AuthPage } from './pages/AuthPage.js';
import { BoardsPage } from './pages/BoardsPage.js';
import { authApi, getCurrentUser } from './api/auth.js';
import { savesApi } from './api/saves.js';

const app = document.getElementById('app');

/* ★ 路由表：boards 不固定路径，用特殊标记 */
const NAV_PATHS = {
    home: '/',
    explore: '/ideas',
    boards: null   // 动态决定：/${username}/
};

let lastListViewPath = '/';

const pinMap = new Map();
mockPins.forEach(p => pinMap.set(Number(p.id), p));
let nextId = mockPins.length + 1;

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

/* ============ 工具 ============ */
function isProfilePath(path) {
    return /^\/[a-zA-Z0-9_]{3,20}\/?$/.test(path)
        && !['/login', '/register', '/boards', '/ideas'].includes(path);
}

function pathToUsername(path) {
    const m = path.match(/^\/([a-zA-Z0-9_]{3,20})\/?$/);
    return m ? m[1] : null;
}

/* ============ 面板 ============ */
const panels = Panels();
app.appendChild(panels);

function syncNav() {
    const path = location.pathname;
    let key = 'home';

    if (path === '/') key = 'home';
    else if (path === '/ideas') key = 'explore';
    else if (path === '/boards' || isProfilePath(path)) key = 'boards';

    panels.setActive(document.querySelector(`.nav-item[data-key="${key}"]`));
}
panels.addEventListener('panel-close', syncNav);

/* ============ 账号菜单 ============ */
const accountMenu = AccountMenu({
    onLogout: () => {
        topbar.setAvatar(null);
        accountMenu.updateUser(null);
        navigate('/');
    }
});
app.appendChild(accountMenu);

/* ============ 侧栏 ============ */
app.appendChild(Sidebar({
    onNavigate: (key, el) => {
        panels.close();

        // ★ 看板：跳到 /${username}/
        if (key === 'boards') {
            const me = getCurrentUser();
            if (!me) {
                navigate('/login');
                return;
            }
            const target = `/${me.username}/`;
            if (target === location.pathname) {
                syncNav();
                return;
            }
            navigate(target);
            return;
        }

        // 其他导航
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
const topbar = Topbar({
    onSearch: (q) => console.log('搜索:', q),
    onOpenAccount: (anchor) => accountMenu.open(anchor)
});
app.appendChild(topbar);

/* ============ 主页 ============ */
const main = document.createElement('main');
main.className = 'main-content home-view';

main.appendChild(FilterBar({
    items: ['全部', '时尚', '家居', '美食', '旅行', '婚礼', '艺术', '健身'],
    onChange: (label) => console.log('切换分类:', label)
}));

const grid = PinGrid({ items: mockPins });
main.appendChild(grid);

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

/* ============ 页面实例 ============ */
const detailPage = DetailPage();

const authPage = AuthPage({
    onSuccess: (user) => {
        topbar.setAvatar(user);
        accountMenu.updateUser(user);
        navigate('/');
    }
});

const boardsPage = BoardsPage();

app.appendChild(authPage);
app.appendChild(boardsPage);
app.appendChild(detailPage);

detailPage.addEventListener('detail-close', () => {
    if (history.length > 1) history.back();
    else navigate(lastListViewPath);
});

detailPage.addEventListener('need-login', () => {
    navigate('/login');
});

/* ============ 打开 Boards 页（指定用户） ============ */
function openBoardsPage(username) {
    const me = getCurrentUser();

    if (!me) {
        navigate('/login');
        return;
    }

    const targetUsername = username || me.username;
    const isSelf = targetUsername === me.username;

    const req = isSelf
        ? savesApi.listMySaves().then(({ pinIds, count }) => ({
            user: me,
            pinIds,
            count
        }))
        : savesApi.listUserSaves(targetUsername);

    req.then(({ user, pinIds }) => {
        const pins = pinIds.map(id => pinMap.get(id)).filter(Boolean);
        boardsPage.open(user, pins);
        main.hidden = true;
        detailPage.close();
        window.scrollTo(0, 0);
        syncNav();      // ★ 高亮"看板"
    }).catch(err => {
        console.error(err);
        if (err.status === 404) alert('用户不存在');
        navigate('/');
    });
}

/* ============ 路由 ============ */
function route(path) {
    // ---- 认证页 ----
    if (path === '/login' || path === '/register') {
        authPage.open(path === '/login' ? 'login' : 'register');
        main.hidden = true;
        boardsPage.close();
        detailPage.close();
        window.scrollTo(0, 0);
        return;
    }
    authPage.close();

    // ---- /boards → 重定向到 /${username}/ ----
    if (path === '/boards') {
        const me = getCurrentUser();
        if (!me) {
            navigate('/login');
            return;
        }
        const target = `/${me.username}/`;
        history.replaceState(null, '', target);
        openBoardsPage(me.username);
        return;
    }

    // ---- /${username}/ ----
    const username = pathToUsername(path);
    if (username) {
        openBoardsPage(username);
        return;
    }

    boardsPage.close();

    // ---- 详情页 ----
    const m = path.match(/^\/pin\/([^/?#]+)\/?$/);
    if (m) {
        const pin = pinMap.get(Number(m[1]));
        if (pin) {
            const related = [...pinMap.values()]
                .filter(p => p.id !== pin.id)
                .sort(() => Math.random() - 0.5)
                .slice(0, 30);

            detailPage.open(pin, related, () => createMorePins(30));
            main.hidden = true;
            window.scrollTo(0, 0);
            return;
        }
        history.replaceState(null, '', '/');
        path = '/';
    }

    // ---- 列表页 ----
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

/* ============ 卡片点击 ============ */
app.addEventListener('click', (e) => {
    if (e.target.closest('.pin-card__overlay button, .pin-card__overlay a')) return;

    const card = e.target.closest('.pin-card');
    if (!card) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    e.preventDefault();
    navigate(`/pin/${card.dataset.id}`);
});

/* ============ 启动 ============ */
async function bootstrap() {
    try {
        const { user } = await authApi.me();
        topbar.setAvatar(user);
        accountMenu.updateUser(user);
    } catch {
        topbar.setAvatar(null);
        accountMenu.updateUser(null);
    }
    route(location.pathname);
}

bootstrap();