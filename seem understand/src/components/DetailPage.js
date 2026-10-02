export function DetailPage() {
    const root = document.createElement('div');
    root.className = 'main-content detail-page';
    root.hidden = true;

    root.innerHTML = `
        <button class="detail-page__back" type="button" aria-label="返回">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path d="m4.41 13 6.3 6.3-1.42 1.4L.6 12l8.7-8.7 1.42 1.4L4.4 11H24v2z"/>
            </svg>
        </button>

        <div class="detail-page__panel">
            <div class="detail-page__media">
                <div class="detail-page__image-wrap">
                    <img class="detail-page__img" alt="">
                </div>
            </div>

            <div class="detail-page__info">
                <div class="detail-page__actions">
                    <div class="detail-page__actions-left">
                        <button class="icon-btn icon-btn--48" type="button" aria-label="收藏">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M14.1 5.6A4.47 4.47 0 0 1 22 8.48V9c0 2.18-1.65 4.56-4.1 6.78a35 35 0 0 1-5.9 4.21 35 35 0 0 1-5.9-4.21C3.64 13.56 2 11.18 2 9v-.53a4.47 4.47 0 0 1 7.9-2.86L12 8.12zm-3.47-2.08A6.47 6.47 0 0 0 0 8.47V9c0 6.18 8.97 11.59 11.07 12.76q.43.24.93.24t.93-.24C15.03 20.6 24 15.18 24 9v-.53a6.47 6.47 0 0 0-11.44-4.14L12 5l-.56-.67q-.38-.45-.8-.81"/></svg>
                        </button>
                        <span class="detail-page__reactions"></span>
                        <button class="icon-btn icon-btn--48" type="button" aria-label="评论">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path d="m20.27 16.72.28-.58q.93-1.89.95-4.14a9.5 9.5 0 1 0-5.36 8.55l.58-.28 4.31.76zm-3.26 5.63A11.5 11.5 0 1 1 22.36 17l.64 3.7a2 2 0 0 1-2.3 2.3z"/></svg>
                        </button>
                        <button class="icon-btn icon-btn--48" type="button" aria-label="分享">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M17.7 5.8 12 .08l-5.7 5.7L7.7 7.2 11 3.9V15h2V3.91l3.3 3.3zM2 18v-5H0v5a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4v-5h-2v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2"/></svg>
                        </button>
                        <button class="icon-btn icon-btn--48" type="button" aria-label="更多">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M2.5 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5m9.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5m9.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5"/></svg>
                        </button>
                    </div>
                    <button class="btn btn--save" type="button">保存</button>
                </div>

                <div class="detail-page__scroll">
                    <div class="detail-page__shop">
                        <a class="detail-page__shop-name" href="#" target="_blank" rel="noopener noreferrer"></a>
                        <svg class="detail-page__verified" viewBox="0 0 24 24" width="16" height="16" aria-label="已验证商家">
                            <path d="M12 24a12 12 0 1 0 0-24 12 12 0 0 0 0 24m-2-6.59-4.7-4.7 1.4-1.42 3.3 3.3 7.3-7.3 1.4 1.42z"/>
                        </svg>
                    </div>

                    <a class="detail-page__title" href="#" target="_blank" rel="noopener noreferrer"></a>

                    <div class="detail-page__price-row">
                        <span class="detail-page__price"></span>
                        <span class="detail-page__price-old"></span>
                    </div>

                    <div class="detail-page__rating">
                        <span class="detail-page__stars"></span>
                        <span class="detail-page__rating-score"></span>
                        <span class="detail-page__rating-count"></span>
                    </div>

                    <a class="btn btn--shop" href="#" target="_blank" rel="noopener noreferrer" hidden>Visit site</a>

                    <div class="detail-page__desc">
                        <h4 class="detail-page__desc-title">Description</h4>
                        <p class="detail-page__desc-text is-clamped"></p>
                        <button class="detail-page__desc-more" type="button">See more</button>
                    </div>
                </div>

                <div class="detail-page__composer">
                    <span class="detail-page__composer-avatar">S</span>
                    <div class="detail-page__composer-input" contenteditable="true" role="textbox" aria-label="添加评论"></div>
                    <button class="icon-btn icon-btn--32" type="button" aria-label="表情">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M7 8.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m10 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.64 4.27A8.8 8.8 0 0 1 12 15c-2 0-3.91-.8-5.64-2.23l1.28-1.54A6.8 6.8 0 0 0 12 13q2.18.02 4.36-1.77zM24 12a12 12 0 1 1-24 0 12 12 0 0 1 24 0M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    const backBtn = root.querySelector('.detail-page__back');
    const img = root.querySelector('.detail-page__img');
    const imageWrap = root.querySelector('.detail-page__image-wrap');
    const reactions = root.querySelector('.detail-page__reactions');
    const shopName = root.querySelector('.detail-page__shop-name');
    const shopRow = root.querySelector('.detail-page__shop');
    const titleEl = root.querySelector('.detail-page__title');
    const priceEl = root.querySelector('.detail-page__price');
    const priceOldEl = root.querySelector('.detail-page__price-old');
    const ratingRow = root.querySelector('.detail-page__rating');
    const starsEl = root.querySelector('.detail-page__stars');
    const scoreEl = root.querySelector('.detail-page__rating-score');
    const countEl = root.querySelector('.detail-page__rating-count');
    const visitBtn = root.querySelector('.btn--shop');
    const descEl = root.querySelector('.detail-page__desc-text');
    const descMore = root.querySelector('.detail-page__desc-more');

    function renderStars(rating) {
        const full = Math.round(rating);
        return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
    }

    function open(pin) {
        img.src = pin.image;
        img.alt = pin.title ?? '';
        if (pin.width && pin.height) {
            imageWrap.style.aspectRatio = `${pin.width} / ${pin.height}`;
        } else {
            imageWrap.style.aspectRatio = '';
        }

        reactions.textContent = pin.reactions ?? '';

        if (pin.shop) {
            shopName.textContent = pin.shop;
            shopName.href = pin.shopUrl ?? '#';
            shopRow.hidden = false;
        } else {
            shopRow.hidden = true;
        }

        titleEl.textContent = pin.title ?? '';
        titleEl.href = pin.link ?? '#';

        if (pin.price != null) {
            priceEl.textContent = `$${pin.price.toFixed(2)}`;
            priceEl.parentElement.hidden = false;
        } else {
            priceEl.parentElement.hidden = true;
        }
        if (pin.oldPrice != null) {
            priceOldEl.textContent = `$${pin.oldPrice.toFixed(2)}`;
            priceOldEl.hidden = false;
        } else {
            priceOldEl.hidden = true;
        }

        if (pin.rating != null) {
            starsEl.textContent = renderStars(pin.rating);
            scoreEl.textContent = pin.rating.toFixed(1);
            countEl.textContent = pin.ratingCount ? `(${pin.ratingCount})` : '';
            ratingRow.hidden = false;
        } else {
            ratingRow.hidden = true;
        }

        if (pin.link) {
            visitBtn.href = pin.link;
            visitBtn.hidden = false;
        } else {
            visitBtn.hidden = true;
        }

        descEl.textContent = pin.description ?? '';
        descEl.classList.add('is-clamped');
        descMore.textContent = 'See more';
        descMore.hidden = !pin.description;

        root.hidden = false;
    }

    function close() {
        root.hidden = true;
    }

    // 返回按钮：派发事件，让 main.js 处理路由
    backBtn.addEventListener('click', () => {
        root.dispatchEvent(new CustomEvent('detail-close', { bubbles: true }));
    });

    // See more / See less
    descMore.addEventListener('click', () => {
        const clamped = descEl.classList.toggle('is-clamped');
        descMore.textContent = clamped ? 'See more' : 'See less';
    });

    root.open = open;
    root.close = close;
    return root;
}