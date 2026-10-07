import './styles/main.scss';
import { Sidebar } from './components/Sidebar.js';
import { Topbar } from './components/Topbar.js';
import { FilterBar } from './components/FilterBar.js';
import { PinGrid } from './components/PinGrid.js';
import { DetailPage } from './components/DetailPage.js';
import { Panels } from './components/Panels.js';
import { AccountMenu } from './components/AccountMenu.js';
import { AuthPage } from './pages/AuthPage.js';
import { BoardsPage } from './pages/BoardsPage.js';
import { CreatePinPage } from './pages/CreatePinPage.js';
import { authApi, getCurrentUser } from './api/auth.js';
import { pinsApi } from './api/pins.js';
import { savesApi } from './api/saves.js';
import { ChangePasswordDialog } from './components/ChangePasswordDialog.js';

const app = document.getElementById('app');

const NAV_PATHS = {
    home: '/',
    explore: '/ideas',
    boards: null
};

let lastListViewPath = '/';

/* ★ 全局：当前用户已保存的 pinId 集合 */
window.__mySavedPinIds = new Set();

const pinMap = new Map();
let sourcePins = [];
let nextFakeId = 9_000_000;

function makeFakePins(count = 30) {
    if (sourcePins.length === 0) return [];

    const batch = [];
    for (let i = 0; i < count; i++) {
        const base = sourcePins[Math.floor(Math.random() * sourcePins.length)];
        const id = nextFakeId++;
        const copy = { ...base, id };
        pinMap.set(id, copy);
        batch.push(copy);
    }
    return batch;
}

function isProfilePath(path) {
    return /^\/[a-zA-Z0-9_]{3,20}\/?$/.test(path)
        && !['/login', '/register', '/boards', '/ideas', '/pin-creation-tool'].includes(path);
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
const changePwdDialog = ChangePasswordDialog();
app.appendChild(changePwdDialog);

const accountMenu = AccountMenu({
    onLogout: () => {
        topbar.setAvatar(null);
        accountMenu.updateUser(null);
        window.__mySavedPinIds = new Set();
        navigate('/');
    },
    onChangePassword: () => {
        changePwdDialog.open();
    }
});
app.appendChild(accountMenu);

/* 密码修改成功后：登出 → 跳登录页 */
changePwdDialog.addEventListener('password-changed', async () => {
    try {
        const { authApi } = await import('./api/auth.js');
        await authApi.logout();
    } catch { }
    topbar.setAvatar(null);
    accountMenu.updateUser(null);
    window.__mySavedPinIds = new Set();
    navigate('/login');
});

/* ============ 侧栏 ============ */
app.appendChild(Sidebar({
    onNavigate: (key, el) => {
        panels.close();

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

const grid = PinGrid({ items: [] });
main.appendChild(grid);

const sentinel = document.createElement('div');
sentinel.style.height = '1px';
main.appendChild(sentinel);

const emptyTip = document.createElement('div');
emptyTip.className = 'home-view__empty';
emptyTip.hidden = true;
emptyTip.innerHTML = `
    <img src="https://s.pinimg.com/gestalt/illustrations/v1/ill.pinboard.spot.light.svg.webp"
         alt="" width="186" height="186" loading="lazy">
    <h2>还没有任何 Pin</h2>
    <p>点击侧栏的"创建"上传第一张 Pin</p>
`;
main.appendChild(emptyTip);

let loading = false;

function loadMoreMain() {
    if (loading || sourcePins.length === 0) return;
    loading = true;

    const batch = makeFakePins(30);

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
        if (sourcePins.length === 0) return;
        const rect = sentinel.getBoundingClientRect();
        if (rect.top < window.innerHeight + 600) loadMoreMain();
    });
}

window.addEventListener('scroll', scheduleMainCheck, { passive: true });

app.appendChild(main);

/* ============ 页面实例 ============ */
const detailPage = DetailPage();

const authPage = AuthPage({
    onSuccess: async (user) => {
        topbar.setAvatar(user);
        accountMenu.updateUser(user);
        await refreshMySaves();      // ★ 登录后同步已保存集合
        navigate('/');
    }
});

const boardsPage = BoardsPage();

const createPinPage = CreatePinPage({
    onCreated: (pin) => {
        pinMap.set(Number(pin.id), pin);
        sourcePins.unshift(pin);

        emptyTip.hidden = true;
        grid.appendItems([pin]);

        const me = getCurrentUser();
        if (me) {
            navigate(`/${me.username}/`);
        } else {
            navigate('/');
        }
    }
});

app.appendChild(authPage);
app.appendChild(boardsPage);
app.appendChild(createPinPage);
app.appendChild(detailPage);

detailPage.addEventListener('detail-close', () => {
    if (history.length > 1) history.back();
    else navigate(lastListViewPath);
});

detailPage.addEventListener('need-login', () => {
    navigate('/login');
});

/* ============ 已保存集合同步 ============ */
async function refreshMySaves() {
    const me = getCurrentUser();
    if (!me) {
        window.__mySavedPinIds = new Set();
        return;
    }
    try {
        const { pinIds } = await savesApi.listMySaves();
        window.__mySavedPinIds = new Set(pinIds);
    } catch {
        window.__mySavedPinIds = new Set();
    }
}

/* ============ 打开 Boards 页 ============ */
function openBoardsPage(username) {
    const me = getCurrentUser();

    if (!me) {
        navigate('/login');
        return;
    }

    const targetUsername = username || me.username;

    savesApi.listUserSaves(targetUsername)
        .then(({ user }) => {
            boardsPage.open({ id: user.id, username: user.username });
            main.hidden = true;
            detailPage.close();
            window.scrollTo(0, 0);
            syncNav();
        })
        .catch(err => {
            console.error(err);
            if (err.status === 404) alert('用户不存在');
            navigate('/');
        });
}

/* ============ 路由 ============ */
function route(path) {
    if (path === '/login' || path === '/register') {
        authPage.open(path === '/login' ? 'login' : 'register');
        main.hidden = true;
        boardsPage.close();
        createPinPage.close();
        detailPage.close();
        window.scrollTo(0, 0);
        return;
    }
    authPage.close();

    if (path === '/pin-creation-tool' || path === '/pin-creation-tool/') {
        const me = getCurrentUser();
        if (!me) {
            navigate('/login');
            return;
        }
        createPinPage.open();
        main.hidden = true;
        boardsPage.close();
        detailPage.close();
        window.scrollTo(0, 0);
        return;
    }
    createPinPage.close();

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

    const username = pathToUsername(path);
    if (username) {
        openBoardsPage(username);
        return;
    }

    boardsPage.close();

    const m = path.match(/^\/pin\/([^/?#]+)\/?$/);
    if (m) {
        const pin = pinMap.get(Number(m[1]));
        if (pin) {
            const related = [...pinMap.values()]
                .filter(p => p.id !== pin.id)
                .sort(() => Math.random() - 0.5)
                .slice(0, 30);

            detailPage.open(pin, related, () => makeFakePins(30));
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

/* ============ 全局点击拦截 ============ */
app.addEventListener('click', async (e) => {
    /* 1. 创建面板里的 Pin 卡片 */
    const createLink = e.target.closest('a.create-card[href="/pin-creation-tool/"]');
    if (createLink) {
        e.preventDefault();
        panels.close();
        navigate('/pin-creation-tool/');
        return;
    }

    /* ★ 2. 主页卡片上的"保存"按钮 */
    const saveBtn = e.target.closest('.pin-card__save');
    if (saveBtn) {
        e.preventDefault();
        e.stopPropagation();

        const card = saveBtn.closest('.pin-card');
        const pinId = Number(card?.dataset.id);
        if (!pinId) return;

        // 未登录 → 去登录
        if (!getCurrentUser()) {
            navigate('/login');
            return;
        }

        const isSaved = window.__mySavedPinIds.has(pinId);
        saveBtn.disabled = true;

        try {
            if (isSaved) {
                await savesApi.unsave(pinId);
                window.__mySavedPinIds.delete(pinId);
                saveBtn.textContent = '保存';
                saveBtn.classList.remove('is-saved');
            } else {
                await savesApi.save(pinId);
                window.__mySavedPinIds.add(pinId);
                saveBtn.textContent = '已保存';
                saveBtn.classList.add('is-saved');
            }
        } catch (err) {
            alert(err.message || '操作失败');
        } finally {
            saveBtn.disabled = false;
        }
        return;
    }

    /* 3. 其他 overlay 元素忽略（分享、更多、Visit site） */
    if (e.target.closest('.pin-card__overlay button, .pin-card__overlay a')) return;

    /* 4. 卡片点击 → 详情页 */
    const card = e.target.closest('.pin-card');
    if (!card) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    e.preventDefault();
    navigate(`/pin/${card.dataset.id}`);
});

/* ============ 启动 ============ */
async function bootstrap() {
    // 拉当前用户
    try {
        const { user } = await authApi.me();
        topbar.setAvatar(user);
        accountMenu.updateUser(user);
        await refreshMySaves();
    } catch {
        topbar.setAvatar(null);
        accountMenu.updateUser(null);
        window.__mySavedPinIds = new Set();
    }

    // 拉全部上传的 pin
    try {
        const { pins } = await pinsApi.listAll();

        sourcePins = pins;
        pins.forEach(p => pinMap.set(Number(p.id), p));

        if (pins.length === 0) {
            emptyTip.hidden = false;
            route(location.pathname);
            return;
        }

        emptyTip.hidden = true;
        const initial = makeFakePins(60);
        grid.appendItems(initial);

        requestAnimationFrame(scheduleMainCheck);
    } catch (e) {
        console.warn('拉取 pin 失败:', e);
        emptyTip.hidden = true;
    }

    route(location.pathname);
}

bootstrap();