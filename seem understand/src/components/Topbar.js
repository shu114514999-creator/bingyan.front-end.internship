import { ICONS } from '../icons/index.js';

export function Topbar({ onSearch, onOpenAccount } = {}) {
    const header = document.createElement('header');
    header.className = 'topbar';

    header.innerHTML = `
        <div class="search-box">
            <span class="search-icon">${ICONS.search}</span>
            <input type="text" placeholder="搜索" aria-label="搜索">
            <button class="search-inner-btn" type="button" aria-label="上传图片搜索" data-tooltip="使用图片搜索">${ICONS.lens}</button>
            <button class="search-inner-btn" type="button" aria-label="语音搜索" data-tooltip="语音搜索">${ICONS.mic}</button>
        </div>
        <div class="topbar-actions">
            <button class="avatar-btn" type="button" aria-label="用户菜单" data-tooltip="你的个人资料">
                <span class="avatar"></span>
            </button>
            <button class="chevron-btn" type="button" aria-label="账号选项" data-tooltip="账户选项">${ICONS.chevron}</button>
        </div>
    `;

    const input = header.querySelector('input');
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') onSearch?.(input.value.trim());
    });

    const avatarBtn = header.querySelector('.avatar-btn');
    const chevronBtn = header.querySelector('.chevron-btn');

    avatarBtn.addEventListener('click', () => onOpenAccount?.(avatarBtn));
    chevronBtn.addEventListener('click', () => onOpenAccount?.(chevronBtn));

    /* ★ 对外暴露"设置头像"接口 */
    const avatarEl = header.querySelector('.avatar');

    const GUEST_SVG = `
        <svg class="avatar__guest" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="#fff" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10m0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 4c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5m-6 5c0-1.42 2.5-3 6-3s6 1.58 6 3z"/>
        </svg>`;

    header.setAvatar = (user) => {
        if (user) {
            avatarEl.textContent = user.username[0].toUpperCase();
            avatarEl.classList.remove('avatar--guest');
        } else {
            avatarEl.innerHTML = GUEST_SVG;
            avatarEl.classList.add('avatar--guest');
        }
    };

    // 初始化：未登录
    header.setAvatar(null);

    return header;
}