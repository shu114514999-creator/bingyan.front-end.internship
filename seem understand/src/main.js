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

// 面板放在最前面
const panels = Panels();
app.appendChild(panels);
const accountMenu = AccountMenu();
app.appendChild(accountMenu);

app.appendChild(Sidebar({
    onNavigate: (key, el) => {
        panels.close();        // 收起面板（内部会把色反还给 Home）
        panels.setActive(el);  // 再把色反落到当前导航项
        console.log('导航到:', key);
    },
    onOpenPanel: (key, anchor) => panels.open(key, anchor)
}));

app.appendChild(Topbar({
    onSearch: (q) => console.log('搜索:', q),
    onOpenAccount: (anchor) => accountMenu.open(anchor)
}));

// ---------------- 数据池 ----------------
const pinMap = new Map();
mockPins.forEach(p => pinMap.set(Number(p.id), p));

// ---------------- 主页视图 ----------------
const main = document.createElement('main');
main.className = 'main-content home-view';

main.appendChild(FilterBar({
    items: ['全部', '时尚', '家居', '美食', '旅行', '婚礼', '艺术', '健身'],
    onChange: (label) => console.log('切换分类:', label)
}));

const grid = PinGrid({ items: mockPins });
main.appendChild(grid);

let loadCount = 0;
const sentinel = document.createElement('div');
sentinel.style.height = '1px';
main.appendChild(sentinel);

const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && loadCount < 5) {
        loadCount++;
        const more = mockPins.map((p, i) => ({
            ...p,
            id: p.id + 1000 * loadCount,
            image: `https://picsum.photos/seed/load${loadCount}_${i}/${p.width}/${p.height}`
        }));
        more.forEach(p => pinMap.set(Number(p.id), p));
        grid.appendItems(more);
    }
}, { rootMargin: '600px' });
io.observe(sentinel);

app.appendChild(main);

// ---------------- 详情页视图 ----------------
const detailPage = DetailPage();
app.appendChild(detailPage);

detailPage.addEventListener('detail-close', () => navigate('/'));

// ---------------- 路由 ----------------
function route(path) {
    const m = path.match(/^\/pin\/([^/?#]+)\/?$/);

    if (m) {
        const pin = pinMap.get(Number(m[1]));
        if (pin) {
            detailPage.open(pin);
            main.hidden = true;
            window.scrollTo(0, 0);
            return;
        }
        history.replaceState(null, '', '/');
    }

    detailPage.close();
    main.hidden = false;
}

function navigate(path) {
    if (path === location.pathname) return;
    history.pushState(null, '', path);
    route(path);
}

window.addEventListener('popstate', () => route(location.pathname));

// ---------------- 全局拦截卡片点击 ----------------
app.addEventListener('click', (e) => {
    if (e.target.closest('.pin-card__overlay button, .pin-card__overlay a')) return;

    const card = e.target.closest('.pin-card');
    if (!card) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    e.preventDefault();
    navigate(`/pin/${card.dataset.id}`);
});

// ---------------- 启动 ----------------
route(location.pathname);