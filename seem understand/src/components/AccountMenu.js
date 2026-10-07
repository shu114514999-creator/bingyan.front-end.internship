const EXT_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M20 4v14h-2V7.41L5.7 19.71l-1.4-1.42L16.58 6H6V4z"/></svg>`;

import { authApi } from '../api/auth.js';

export function AccountMenu({ onLogout, onChangePassword } = {}) {
    const root = document.createElement('div');
    root.className = 'account-menu';
    root.setAttribute('role', 'menu');
    root.setAttribute('aria-label', 'Account options');
    root.hidden = true;

    root.innerHTML = `
        <div class="account-menu__group">
            <div class="account-menu__title">Currently in</div>

            <a class="account-menu__item account-menu__item--current"
               href="#" role="menuitem" data-action="profile">
                <span class="account-menu__avatar"></span>
                <span class="account-menu__body">
                    <span class="account-menu__name"></span>
                    <span class="account-menu__sub">Personal</span>
                    <span class="account-menu__sub account-menu__sub--email"></span>
                </span>
            </a>

            <a class="account-menu__item"
               href="https://www.pinterest.com/convert-business"
               target="_self" role="menuitem">
                <span class="account-menu__label">Convert to business</span>
            </a>
        </div>

        <div class="account-menu__group">
            <div class="account-menu__title">Your accounts</div>

            <a class="account-menu__item" href="/add-account/" role="menuitem">
                <span class="account-menu__label">Add Pinterest account</span>
            </a>

            <button class="account-menu__item" type="button" role="menuitem" data-action="change-password" hidden>
                <span class="account-menu__label">修改密码</span>
            </button>

            <button class="account-menu__item" type="button" role="menuitem" data-action="logout">
                <span class="account-menu__label">Log out</span>
            </button>
        </div>
    `;

    const avatarEl = root.querySelector('.account-menu__avatar');
    const nameEl = root.querySelector('.account-menu__name');
    const emailEl = root.querySelector('.account-menu__sub--email');
    const profileEl = root.querySelector('[data-action="profile"]');
    const logoutBtn = root.querySelector('[data-action="logout"]');
    const changePwdBtn = root.querySelector('[data-action="change-password"]');

    /* 更新菜单里的用户信息 */
    root.updateUser = (user) => {
        if (user) {
            avatarEl.textContent = user.username[0].toUpperCase();
            nameEl.textContent = user.username;
            emailEl.textContent = user.email;
            profileEl.href = `/${user.username}/`;
            logoutBtn.hidden = false;
            changePwdBtn.hidden = false;
        } else {
            avatarEl.textContent = '?';
            nameEl.textContent = '未登录';
            emailEl.textContent = '';
            profileEl.href = '/login';
            logoutBtn.hidden = true;
            changePwdBtn.hidden = true;
        }
    };

    /* 登出 */
    logoutBtn.addEventListener('click', async () => {
        try {
            await authApi.logout();
        } catch (e) { /* 忽略 */ }
        close();
        onLogout?.();
    });

    /* ★ 修改密码 */
    changePwdBtn.addEventListener('click', () => {
        close();
        onChangePassword?.();
    });

    /* ---------- 打开 / 关闭 / 定位（保持原样） ---------- */
    let isOpen = false;
    let anchorEl = null;

    function position() {
        if (!anchorEl) return;
        const rect = anchorEl.getBoundingClientRect();
        const GAP = 12;
        root.style.top = `${rect.bottom + GAP}px`;
        root.style.right = `${window.innerWidth - rect.right}px`;
    }

    function open(anchor) {
        if (isOpen && anchorEl === anchor) {
            close();
            return;
        }
        close();
        anchorEl = anchor;
        root.hidden = false;
        position();
        requestAnimationFrame(position);
        isOpen = true;
        anchor?.classList.add('is-active');
    }

    function close() {
        if (!isOpen) return;
        root.hidden = true;
        anchorEl?.classList.remove('is-active');
        anchorEl = null;
        isOpen = false;
    }

    document.addEventListener('mousedown', (e) => {
        if (!isOpen) return;
        if (root.contains(e.target)) return;
        if (e.target.closest('.avatar-btn, .chevron-btn')) return;
        close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', () => {
        if (isOpen) position();
    });

    root.open = open;
    root.close = close;

    // 初始：未登录状态
    root.updateUser(null);

    return root;
}