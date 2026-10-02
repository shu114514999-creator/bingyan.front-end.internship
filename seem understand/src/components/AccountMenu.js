const EXT_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M20 4v14h-2V7.41L5.7 19.71l-1.4-1.42L16.58 6H6V4z"/></svg>`;

export function AccountMenu() {
    const root = document.createElement('div');
    root.className = 'account-menu';
    root.setAttribute('role', 'menu');
    root.setAttribute('aria-label', 'Account options');
    root.hidden = true;

    root.innerHTML = `
        <div class="account-menu__group">
            <div class="account-menu__title">Currently in</div>

            <a class="account-menu__item account-menu__item--current"
               href="/shu114514999/" role="menuitem">
                <span class="account-menu__avatar">S</span>
                <span class="account-menu__body">
                    <span class="account-menu__name">shu</span>
                    <span class="account-menu__sub">Personal</span>
                    <span class="account-menu__sub account-menu__sub--email">shu114514999@gmail.com</span>
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

            <button class="account-menu__item" type="button" role="menuitem">
                <span class="account-menu__label">Log out</span>
            </button>
        </div>
    `;

    let isOpen = false;
    let anchorEl = null;

    function position() {
        if (!anchorEl) return;
        const rect = anchorEl.getBoundingClientRect();
        const MARGIN = 8;
        const GAP = 12;

        // 顶栏底部 + 12px，右边缘与 anchor 对齐
        const top = rect.bottom + GAP;
        const right = window.innerWidth - rect.right;

        root.style.top = `${top}px`;
        root.style.right = `${right}px`;
    }

    function open(anchor) {
        if (isOpen && anchorEl === anchor) {
            close();
            return;
        }
        close();

        anchorEl = anchor;
        root.hidden = false;
        // 先渲染，再定位（要拿到 root 的尺寸）
        position();
        // 一帧后再校正（等字体/内容撑开）
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

    // 点击外部 / Esc 关闭
    document.addEventListener('mousedown', (e) => {
        if (!isOpen) return;
        if (root.contains(e.target)) return;
        if (e.target.closest('.avatar-btn, .chevron-btn')) return;
        close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    // 窗口尺寸改变时重新定位
    window.addEventListener('resize', () => {
        if (isOpen) position();
    });

    root.open = open;
    root.close = close;
    return root;
}