import { ICONS } from '../icons/index.js';

export function Topbar({ onSearch } = {}) {
    const header = document.createElement('header');
    header.className = 'topbar';

    header.innerHTML = `
        <div class="search-box">
            <span class="search-icon">${ICONS.search}</span>
            <input type="text" placeholder="搜索" aria-label="搜索">
            <button class="search-inner-btn" type="button" aria-label="上传图片搜索">${ICONS.lens}</button>
            <button class="search-inner-btn" type="button" aria-label="语音搜索">${ICONS.mic}</button>
        </div>
        <div class="topbar-actions">
            <button class="avatar-btn" type="button" aria-label="用户菜单">
                <span class="avatar">S</span>
            </button>
            <button class="chevron-btn" type="button" aria-label="账号选项">${ICONS.chevron}</button>
        </div>
    `;

    const input = header.querySelector('input');
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') onSearch?.(input.value.trim());
    });

    return header;
}