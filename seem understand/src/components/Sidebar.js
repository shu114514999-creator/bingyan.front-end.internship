import { ICONS } from '../icons/index.js';

const NAV_ITEMS = [
    { key: 'home', label: '首页', href: '/', icon: 'home' },
    { key: 'explore', label: '探索', href: '/ideas', icon: 'explore' },
    { key: 'boards', label: '看板', href: '/boards', icon: 'boards' },
    { key: 'create', label: '创建', icon: 'create', isButton: true, panel: 'create' },
    { key: 'updates', label: '更新', icon: 'bell', isButton: true, panel: 'updates' },
    { key: 'messages', label: '消息', icon: 'messages', isButton: true, panel: 'messages' }
];

/* 同时渲染 outline + fill 两个 svg */
const renderDualIcon = (name) => {
    const outline = ICONS[name];
    const fill = ICONS[`${name}Fill`] ?? outline;

    return (
        outline.replace('<svg ', '<svg class="icon-outline" ') +
        fill.replace('<svg ', '<svg class="icon-fill" ')
    );
};

export function Sidebar({ onNavigate, onOpenPanel } = {}) {
    const nav = document.createElement('nav');
    nav.className = 'sidebar';

    const topNav = document.createElement('div');
    topNav.className = 'top-nav';

    // ---- logo（不参与双图切换，单独处理） ----
    const logoItem = document.createElement('div');
    logoItem.className = 'nav-item logo-item';
    logoItem.dataset.tooltip = 'Pinterest';
    logoItem.innerHTML = `<a href="/" aria-label="Pinterest">${ICONS.logo}</a>`;
    topNav.appendChild(logoItem);

    // ---- 主图标 ----
    NAV_ITEMS.forEach(item => {
        const wrap = document.createElement('div');
        wrap.className = 'nav-item';
        wrap.dataset.key = item.key;
        wrap.dataset.tooltip = item.label;
        if (item.key === 'home') wrap.classList.add('active');

        wrap.innerHTML = item.isButton
            ? `<button class="nav-btn" type="button" aria-label="${item.label}">${renderDualIcon(item.icon)}</button>`
            : `<a href="${item.href}" aria-label="${item.label}">${renderDualIcon(item.icon)}</a>`;

        wrap.addEventListener('click', (e) => {
            if (item.panel) {
                e.preventDefault();
                onOpenPanel?.(item.panel, wrap);
                return;
            }
            onNavigate?.(item.key, wrap);
        });

        topNav.appendChild(wrap);
    });

    nav.appendChild(topNav);

    // ---- 底部设置 ----
    const bottomNav = document.createElement('div');
    bottomNav.className = 'bottom-nav';

    const settingsItem = document.createElement('div');
    settingsItem.className = 'nav-item';
    settingsItem.dataset.key = 'settings';
    settingsItem.dataset.tooltip = '设置';
    settingsItem.innerHTML = `<button class="nav-btn" type="button" aria-label="设置">${renderDualIcon('settings')}</button>`;

    settingsItem.addEventListener('click', () => {
        onOpenPanel?.('settings', settingsItem);
    });

    bottomNav.appendChild(settingsItem);
    nav.appendChild(bottomNav);

    return nav;
}