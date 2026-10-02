const CLOSE_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="m12 13.41 8.3 8.3 1.4-1.42L13.42 12l8.3-8.3-1.42-1.4-8.3 8.28-8.3-8.3L2.3 3.7l8.28 8.3-8.3 8.3 1.42 1.4z"/></svg>`;

const PANEL_CONTENT = {
    create: {
        title: 'Create',
        body: `
        <div class="create-cards">
            <a class="create-card" href="/pin-creation-tool/" target="_self">
                <div class="create-card__thumb">
                    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                        <path d="M5 3h2a1 1 0 0 1 1 1v3.69l-.92.2a5 5 0 0 0-3.97 4.66l-.1 2.4A1 1 0 0 0 4 16h7v2.3q0 2.7.66 5.33l.09.37h.5l.1-.37a22 22 0 0 0 .65-5.34V16h7a1 1 0 0 0 1-1.1l-.24-2.58a5 5 0 0 0-3.9-4.43l-.86-.2V4a1 1 0 0 1 1-1h2V1H5zm5 1a3 3 0 0 0-.17-1h4.34A3 3 0 0 0 14 4v5.3l2.43.54a3 3 0 0 1 2.34 2.66l.13 1.5H5.05l.06-1.36a3 3 0 0 1 2.38-2.8L10 9.31z"/>
                    </svg>
                </div>
                <div class="create-card__body">
                    <div class="create-card__title">Pin</div>
                    <div class="create-card__desc">Post your photos or videos and add links, stickers, effects and more</div>
                </div>
            </a>

            <a class="create-card" href="#" target="_self">
                <div class="create-card__thumb">
                    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                        <path d="M23 5a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4zm-10 6V3h6a2 2 0 0 1 2 2v6zm8 8a2 2 0 0 1-2 2h-6v-8h8zM5 3h6v18H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2"/>
                    </svg>
                </div>
                <div class="create-card__body">
                    <div class="create-card__title">Board</div>
                    <div class="create-card__desc">Organize a collection of your favorite Pins by creating a board</div>
                </div>
            </a>

            <a class="create-card" href="/collage-creation-tool" target="_self">
                <div class="create-card__thumb">
                    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                        <path d="M19.95 1h-4.82a4 4 0 0 0-3.44-.66L3.97 2.4a4 4 0 0 0-2.83 4.9l.25.95a5 5 0 0 1 2-.24l-.32-1.23a2 2 0 0 1 1.41-2.45l7.73-2.07a2 2 0 0 1 2.45 1.41l3.62 13.53a2 2 0 0 1-1.41 2.45l-1.53.4a2 2 0 0 1-.27 1.43L14.13 23h5.82a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4M16.6 3.17 16.54 3h3.41a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-1.3a4 4 0 0 0 1.57-4.31zM4.86 18.64l.48-.33 4.98 2.66q.59.4 1.25.4a2.2 2.2 0 0 0 1.78-.93L7.34 17l6-3.44a2.2 2.2 0 0 0-3.02-.53l-4.98 2.66-.48-.33a3 3 0 1 0-3.48.17L3.6 17l-2.22 1.47a3 3 0 1 0 3.48.17M4 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-2-8a1 1 0 1 1 2 0 1 1 0 0 1-2 0"/>
                    </svg>
                </div>
                <div class="create-card__body">
                    <div class="create-card__title">Collage</div>
                    <div class="create-card__desc">Mix and match ideas to build your vision and create something new</div>
                </div>
            </a>
        </div>
    `
    },

    updates: {
        title: 'Notifications',
        body: `
        <div class="panel-empty">
            <img class="panel-empty__illus"
                 src="https://s.pinimg.com/gestalt/illustrations/v1/ill.sunglasses.spot.light.svg.webp"
                 alt=""
                 loading="lazy">
            <h2 class="panel-empty__title">Updates are on their way</h2>
            <p class="panel-empty__desc">
                Use updates to see activity on your Pins and boards and get tips on topics to explore. They'll be here soon.
            </p>
        </div>
    `
    },

    messages: {
        title: 'Messages',
        body: `
        <div class="messages-actions">
            <button class="messages-action" type="button">
                <span class="messages-action__icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path d="M23.3458 0.633387C22.4924 -0.211454 21.1083 -0.211454 20.2549 0.633387L18.7363 2.13571L21.8272 5.1931L23.3727 3.66441C24.2268 2.82023 24.1999 1.47756 23.3458 0.633387ZM17.762 3.10349L9.39669 11.3893L8.35883 15.6412L12.4876 14.4467L20.8963 6.23791L17.762 3.10349ZM4.70156 1.01393C2.10496 1.01393 0 3.16788 0 5.82491V19.1887C0 21.8458 2.10496 23.9997 4.70156 23.9997H18.2838C20.8804 23.9997 22.9854 21.8458 22.9854 19.1887V14.074C22.9854 13.1884 22.2838 12.5068 21.4182 12.5068C20.5527 12.5068 19.851 13.1884 19.851 14.074V19.1887C19.851 20.0744 19.1494 20.7924 18.2838 20.7924H4.70156C3.83603 20.7924 3.13437 20.0744 3.13437 19.1887V5.82491C3.13437 4.93923 3.83603 4.22125 4.70156 4.22125H9.92552C10.7911 4.22125 11.4927 3.50326 11.4927 2.61759C11.4927 1.73191 10.7911 1.01393 9.92552 1.01393H4.70156Z"/>
                    </svg>
                </span>
                <span class="messages-action__label">New message</span>
            </button>

            <div class="messages-divider"></div>

            <button class="messages-action messages-action--multi" type="button">
                <span class="messages-action__icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path d="M12 11a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M8.5 5.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0M3 23h9v-2H4.06a8 8 0 0 1 11.05-6.37l.78-1.85A10 10 0 0 0 2 22a1 1 0 0 0 1 1m17-3h4v-2h-4v-4h-2v4h-4v2h4v4h2z"/>
                    </svg>
                </span>
                <span class="messages-action__body">
                    <span class="messages-action__label">Invite your friends</span>
                    <span class="messages-action__sub">Connect to start chatting</span>
                </span>
            </button>
        </div>

        <div class="panel-empty">
            <img class="panel-empty__illus"
                 src="https://s.pinimg.com/gestalt/illustrations/v1/ill.messagebottle.spot.light.svg.webp"
                 alt=""
                 loading="lazy">
            <h2 class="panel-empty__title">Start a conversation</h2>
            <p class="panel-empty__desc">
                Use messages to chat with friends, share Pins and boards, and plan ideas together. Your conversations will appear here.
            </p>
        </div>
    `
    },

    settings: {
        title: 'Settings & Support',
        body: `
        <div class="settings-menu">
            <a class="settings-item" href="/settings">Settings</a>
            <a class="settings-item" href="/edit/">Refine your recommendations</a>
            <a class="settings-item" href="/settings/claim">Link to Pinterest</a>
            <a class="settings-item" href="/reports-and-violations/">Reports and violations center</a>
            <button class="settings-item" type="button">Install the Windows app</button>

            <a class="settings-item" href="https://www.pinterest.com/public-beta/" target="_blank" rel="noopener noreferrer">
                <span>Be a beta tester</span>
                <svg class="settings-item__ext" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path d="M20 4v14h-2V7.41L5.7 19.71l-1.4-1.42L16.58 6H6V4z"/>
                </svg>
            </a>

            <div class="settings-group">
                <div class="settings-group__title">Support</div>

                <a class="settings-item" href="https://www.pinterest.com/_/_/help/?source=gear_menu_web" target="_blank" rel="noopener noreferrer">
                    <span>Help center</span>
                    <svg class="settings-item__ext" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        <path d="M20 4v14h-2V7.41L5.7 19.71l-1.4-1.42L16.58 6H6V4z"/>
                    </svg>
                </a>

                <a class="settings-item" href="https://developers.pinterest.com/tools/widget-builder/" target="_blank" rel="noopener noreferrer">
                    <span>Create widget</span>
                    <svg class="settings-item__ext" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        <path d="M20 4v14h-2V7.41L5.7 19.71l-1.4-1.42L16.58 6H6V4z"/>
                    </svg>
                </a>

                <a class="settings-item" href="https://www.pinterest.com/_/_/policy/copyright/" target="_blank" rel="noopener noreferrer">
                    <span>Removals</span>
                    <svg class="settings-item__ext" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        <path d="M20 4v14h-2V7.41L5.7 19.71l-1.4-1.42L16.58 6H6V4z"/>
                    </svg>
                </a>

                <a class="settings-item" href="https://help.pinterest.com/en/article/personalized-ads-on-pinterest" target="_blank" rel="noopener noreferrer">
                    <span>Personalized Ads</span>
                    <svg class="settings-item__ext" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        <path d="M20 4v14h-2V7.41L5.7 19.71l-1.4-1.42L16.58 6H6V4z"/>
                    </svg>
                </a>

                <a class="settings-item" href="/settings/privacy">Your privacy rights</a>

                <a class="settings-item" href="https://www.pinterest.com/_/_/policy/privacy-policy/" target="_blank" rel="noopener noreferrer">
                    <span>Privacy policy</span>
                    <svg class="settings-item__ext" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        <path d="M20 4v14h-2V7.41L5.7 19.71l-1.4-1.42L16.58 6H6V4z"/>
                    </svg>
                </a>

                <a class="settings-item" href="/_/_/policy/terms-of-service/" target="_blank" rel="noopener noreferrer">
                    <span>Terms of service</span>
                    <svg class="settings-item__ext" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        <path d="M20 4v14h-2V7.41L5.7 19.71l-1.4-1.42L16.58 6H6V4z"/>
                    </svg>
                </a>
            </div>

            <div class="settings-group">
                <div class="settings-group__title">Account deactivation</div>

                <a class="settings-item settings-item--multi" href="/deactivate-account/">
                    <span class="settings-item__label">Deactivate account</span>
                    <span class="settings-item__sub">Hide your Pins and profile</span>
                </a>

                <a class="settings-item settings-item--multi" href="/close-account/">
                    <span class="settings-item__label">Delete your data and account</span>
                    <span class="settings-item__sub">Delete your data and account</span>
                </a>
            </div>

            <div class="settings-group">
                <div class="settings-group__title">Resources</div>
                <div class="settings-resources">
                    <a href="/_/_/about/" target="_blank" rel="noopener noreferrer">About</a>
                    <a href="https://www.pinterest.com/_/_/blog/" target="_blank" rel="noopener noreferrer">Blog</a>
                    <a href="https://www.pinterest.com/_/_/business/" target="_blank" rel="noopener noreferrer">Businesses</a>
                    <a href="https://careers.pinterest.com/" target="_blank" rel="noopener noreferrer">Careers</a>
                    <a href="https://developers.pinterest.com" target="_blank" rel="noopener noreferrer">Developers</a>
                </div>
            </div>
        </div>
    `
    }
};

export function Panels() {
    const root = document.createElement('div');
    root.className = 'panels-root';

    const els = {};

    Object.entries(PANEL_CONTENT).forEach(([key, { title, subtitle, body }]) => {
        const el = document.createElement('div');
        el.className = 'flyout';
        el.dataset.panel = key;
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-label', title || 'Panel');

        const headerHtml = title
            ? `<header class="flyout__header">
                   <h3 class="flyout__title">${title}</h3>
                   ${subtitle ? `<p class="flyout__subtitle">${subtitle}</p>` : ''}
               </header>`
            : '';

        el.innerHTML = `
            ${headerHtml}
            <button class="flyout__close" type="button" aria-label="关闭">${CLOSE_ICON}</button>
            <div class="flyout__body">${body}</div>
        `;

        root.appendChild(el);
        els[key] = el;
    });

    let currentKey = null;
    let currentAnchor = null;

    const getHomeEl = () => document.querySelector('.nav-item[data-key="home"]');

    function setActiveNav(el) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        el?.classList.add('active');
    }

    function open(key, anchor) {
        if (currentKey === key) {
            close();
            return;
        }

        if (currentKey) {
            els[currentKey].classList.remove('is-open');
        }

        const el = els[key];
        if (!el) return;

        el.classList.add('is-open');
        root.classList.add('is-open');
        document.body.classList.add('panel-open');

        setActiveNav(anchor);

        currentKey = key;
        currentAnchor = anchor;
    }

    function close() {
        if (!currentKey) return;

        els[currentKey].classList.remove('is-open');
        root.classList.remove('is-open');
        document.body.classList.remove('panel-open');

        setActiveNav(getHomeEl());

        currentKey = null;
        currentAnchor = null;
    }

    root.querySelectorAll('.flyout__close').forEach(btn => {
        btn.addEventListener('click', close);
    });

    document.addEventListener('mousedown', (e) => {
        if (!currentKey) return;
        if (root.contains(e.target)) return;
        if (e.target.closest('.nav-item')) return;
        close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    root.open = open;
    root.close = close;
    root.setActive = setActiveNav;
    return root;
}