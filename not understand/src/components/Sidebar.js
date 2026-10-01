import { ICONS } from '../icons/index.js';

const NAV_ITEMS = [
    { key: 'home',     label: '首页', href: '/',        icon: 'home' },
    { key: 'explore',  label: '探索', href: '/ideas',   icon: 'explore' },
    { key: 'boards',   label: '看板', href: '/boards',  icon: 'boards' },
    { key: 'create',   label: '创建', href: '/create',  icon: 'create', isButton: true },
    { key: 'updates',  label: '更新', href: '/updates', icon: 'bell',   isButton: true },
    { key: 'messages', label: '消息', href: '/messages',icon: 'messages', isButton: true }
];

export function Sidebar({ onNavigate } = {}) {
    const nav = document.createElement('nav');
    nav.className = 'sidebar';

    const topNav = document.createElement('div');
    topNav.className = 'top-nav';

    const logoItem = document.createElement('div');
    logoItem.className = 'nav-item logo-item';
    logoItem.innerHTML = `<a href="/" aria-label="Pinterest">${ICONS.logo}</a>`;
    topNav.appendChild(logoItem);

    NAV_ITEMS.forEach(item => {
        const wrap = document.createElement('div');
        wrap.className = 'nav-item';
        wrap.dataset.key = item.key;
        if (item.key === 'home') wrap.classList.add('active');

        wrap.innerHTML = item.isButton
            ? `<button class="nav-btn" type="button" aria-label="${item.label}">${ICONS[item.icon]}</button>`
            : `<a href="${item.href}" aria-label="${item.label}">${ICONS[item.icon]}</a>`;

        wrap.addEventListener('click', () => {
            nav.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            wrap.classList.add('active');
            onNavigate?.(item.key);
        });

        topNav.appendChild(wrap);
    });

    nav.appendChild(topNav);

    const bottomNav = document.createElement('div');
    bottomNav.className = 'bottom-nav';
    const settingsItem = document.createElement('div');
    settingsItem.className = 'nav-item';
    settingsItem.innerHTML = `<button class="nav-btn" type="button" aria-label="设置">${ICONS.settings}</button>`;
    bottomNav.appendChild(settingsItem);
    nav.appendChild(bottomNav);

    return nav;
}