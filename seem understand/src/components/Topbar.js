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
                <span class="avatar">S</span>
            </button>
            <button class="chevron-btn" type="button" aria-label="账号选项" data-tooltip="账户选项">${ICONS.chevron}</button>
        </div>
    `;

    const input = header.querySelector('input');
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') onSearch?.(input.value.trim());
    });

    // ★ 新增：头像按钮和 chevron 按钮都触发同一个菜单
    const avatarBtn = header.querySelector('.avatar-btn');
    const chevronBtn = header.querySelector('.chevron-btn');

    avatarBtn.addEventListener('click', () => onOpenAccount?.(avatarBtn));
    chevronBtn.addEventListener('click', () => onOpenAccount?.(chevronBtn));

    return header;
}