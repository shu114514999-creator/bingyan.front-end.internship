import { authApi } from '../api/auth.js';

export function ChangePasswordDialog() {
    const root = document.createElement('div');
    root.className = 'change-pwd';
    root.hidden = true;

    root.innerHTML = `
        <div class="change-pwd__backdrop"></div>
        <div class="change-pwd__dialog" role="dialog" aria-modal="true" aria-label="修改密码">
            <header class="change-pwd__header">
                <h2 class="change-pwd__title">修改密码</h2>
                <button class="change-pwd__close" type="button" aria-label="关闭">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path d="m12 13.41 8.3 8.3 1.4-1.42L13.42 12l8.3-8.3-1.42-1.4-8.3 8.28-8.3-8.3L2.3 3.7l8.28 8.3-8.3 8.3 1.42 1.4z"/>
                    </svg>
                </button>
            </header>

            <form class="change-pwd__form" novalidate>
                <label class="change-pwd__field">
                    <span class="change-pwd__label">当前密码</span>
                    <input class="change-pwd__input" name="oldPassword" type="password" autocomplete="current-password">
                </label>

                <label class="change-pwd__field">
                    <span class="change-pwd__label">新密码</span>
                    <input class="change-pwd__input" name="newPassword" type="password" autocomplete="new-password">
                </label>

                <label class="change-pwd__field">
                    <span class="change-pwd__label">确认新密码</span>
                    <input class="change-pwd__input" name="confirmPassword" type="password" autocomplete="new-password">
                </label>

                <p class="change-pwd__error" hidden></p>

                <div class="change-pwd__actions">
                    <button class="change-pwd__btn change-pwd__btn--ghost" type="button" data-action="cancel">取消</button>
                    <button class="change-pwd__btn change-pwd__btn--primary" type="submit">确认修改</button>
                </div>
            </form>
        </div>
    `;

    const backdropEl = root.querySelector('.change-pwd__backdrop');
    const closeBtn = root.querySelector('.change-pwd__close');
    const cancelBtn = root.querySelector('[data-action="cancel"]');
    const formEl = root.querySelector('.change-pwd__form');
    const errorEl = root.querySelector('.change-pwd__error');
    const submitEl = root.querySelector('button[type="submit"]');

    function resetForm() {
        formEl.reset();
        errorEl.hidden = true;
        errorEl.textContent = '';
        submitEl.disabled = false;
        submitEl.textContent = '确认修改';
    }

    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.hidden = false;
    }

    function open() {
        resetForm();
        root.hidden = false;
        requestAnimationFrame(() => root.classList.add('is-open'));
        setTimeout(() => formEl.elements.oldPassword.focus(), 100);
    }

    function close() {
        root.classList.remove('is-open');
        setTimeout(() => {
            root.hidden = true;
            resetForm();
        }, 200);
    }

    /* ---------- 事件 ---------- */
    backdropEl.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !root.hidden) close();
    });

    formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.hidden = true;

        const oldPassword = formEl.elements.oldPassword.value;
        const newPassword = formEl.elements.newPassword.value;
        const confirmPassword = formEl.elements.confirmPassword.value;

        if (!oldPassword) return showError('请输入当前密码');
        if (newPassword.length < 6) return showError('新密码至少 6 位');
        if (newPassword !== confirmPassword) return showError('两次输入的新密码不一致');
        if (newPassword === oldPassword) return showError('新密码不能与当前密码相同');

        submitEl.disabled = true;
        submitEl.textContent = '提交中…';

        try {
            await authApi.changePassword(oldPassword, newPassword);
            alert('密码修改成功，请重新登录');
            close();
            /* 通知外部：跳转 / 登出 */
            root.dispatchEvent(new CustomEvent('password-changed', { bubbles: true }));
        } catch (err) {
            showError(err.message || '修改失败');
            submitEl.disabled = false;
            submitEl.textContent = '确认修改';
        }
    });

    root.open = open;
    root.close = close;
    return root;
}