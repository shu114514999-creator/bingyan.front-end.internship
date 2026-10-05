import { authApi } from '../api/auth.js';

export function AuthPage({ onSuccess } = {}) {
    const root = document.createElement('div');
    root.className = 'main-content auth-page';
    root.hidden = true;

    let currentMode = 'login';

    root.innerHTML = `
        <div class="auth-page__card">
            <h1 class="auth-page__title"></h1>

            <form class="auth-page__form">
                <label class="auth-page__field" data-field="username">
                    <span class="auth-page__label">用户名</span>
                    <input class="auth-page__input" name="username" autocomplete="username">
                </label>

                <label class="auth-page__field" data-field="email">
                    <span class="auth-page__label">邮箱</span>
                    <input class="auth-page__input" name="email" type="email" autocomplete="email">
                </label>

                <label class="auth-page__field" data-field="identifier">
                    <span class="auth-page__label">用户名或邮箱</span>
                    <input class="auth-page__input" name="identifier" autocomplete="username">
                </label>

                <label class="auth-page__field">
                    <span class="auth-page__label">密码</span>
                    <input class="auth-page__input" name="password" type="password" autocomplete="current-password">
                </label>

                <p class="auth-page__error" hidden></p>

                <button class="auth-page__submit" type="submit"></button>
            </form>

            <p class="auth-page__switch">
                <span class="auth-page__switch-text"></span>
                <button class="auth-page__switch-btn" type="button"></button>
            </p>
        </div>
    `;

    const titleEl = root.querySelector('.auth-page__title');
    const formEl = root.querySelector('.auth-page__form');
    const errorEl = root.querySelector('.auth-page__error');
    const submitEl = root.querySelector('.auth-page__submit');
    const switchText = root.querySelector('.auth-page__switch-text');
    const switchBtn = root.querySelector('.auth-page__switch-btn');

    const fieldUsername = root.querySelector('[data-field="username"]');
    const fieldEmail = root.querySelector('[data-field="email"]');
    const fieldIdentifier = root.querySelector('[data-field="identifier"]');

    function applyMode() {
        const isLogin = currentMode === 'login';

        titleEl.textContent = isLogin ? '登录' : '注册';
        submitEl.textContent = isLogin ? '登录' : '注册';
        switchText.textContent = isLogin ? '还没有账号？' : '已有账号？';
        switchBtn.textContent = isLogin ? '去注册' : '去登录';

        fieldUsername.hidden = isLogin;
        fieldEmail.hidden = isLogin;
        fieldIdentifier.hidden = !isLogin;

        errorEl.hidden = true;
        formEl.reset();
    }

    formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.hidden = true;
        submitEl.disabled = true;

        const fd = new FormData(formEl);

        try {
            let user;
            if (currentMode === 'login') {
                const r = await authApi.login(
                    String(fd.get('identifier') ?? '').trim(),
                    String(fd.get('password') ?? '')
                );
                user = r.user;
            } else {
                const r = await authApi.register(
                    String(fd.get('username') ?? '').trim(),
                    String(fd.get('email') ?? '').trim(),
                    String(fd.get('password') ?? '')
                );
                user = r.user;
            }
            onSuccess?.(user);
        } catch (err) {
            errorEl.textContent = err.message || '请求失败';
            errorEl.hidden = false;
        } finally {
            submitEl.disabled = false;
        }
    });

    switchBtn.addEventListener('click', () => {
        currentMode = currentMode === 'login' ? 'register' : 'login';
        applyMode();
    });

    root.open = (m) => {
        if (m) currentMode = m;
        applyMode();
        root.hidden = false;
    };
    root.close = () => { root.hidden = true; };

    applyMode();
    return root;
}