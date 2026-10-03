import { ICONS } from '../icons/index.js';

const loadedImages = new Set();
const PLACEHOLDER_RATIO = 3 / 4;

export function PinCard(data) {
    const card = document.createElement('article');
    card.className = 'pin-card';
    card.dataset.id = data.id;
    card.dataset.state = 'loading';   // loading | colored | loaded

    card.innerHTML = `
        <a class="pin-card__link" href="/pin/${data.id}" aria-label="${data.title ?? ''}">
            <div class="pin-card__image" style="aspect-ratio: ${PLACEHOLDER_RATIO};">
                <img class="pin-card__img" alt="" decoding="async">
            </div>
        </a>
        <div class="pin-card__overlay">
            <button class="pin-card__save" type="button">保存</button>
            <div class="pin-card__bottom">
                ${data.link
            ? `<a class="pin-card__visit" href="${data.link}" target="_blank" rel="noopener noreferrer">Visit site</a>`
            : '<span></span>'}
                <div class="pin-card__actions">
                    <button class="pin-card__action" type="button" aria-label="分享">${ICONS.share}</button>
                    <button class="pin-card__action" type="button" aria-label="更多操作">${ICONS.more}</button>
                </div>
            </div>
        </div>
    `;

    const imageEl = card.querySelector('.pin-card__image');
    const imgEl = card.querySelector('.pin-card__img');
    const linkEl = card.querySelector('.pin-card__link');

    card.hydrate = (full) => {
        if (full.width && full.height) {
            imageEl.style.aspectRatio = `${full.width} / ${full.height}`;
        }
        if (full.dominantColor) {
            imageEl.style.background = full.dominantColor;
        }
        if (full.title != null) {
            imgEl.alt = full.title;
            linkEl.setAttribute('aria-label', full.title);
        }
        linkEl.href = `/pin/${full.id}`;
        card.dataset.id = full.id;

        if (full.image) {
            if (loadedImages.has(full.image)) {
                // ★ 命中缓存：直接 loaded，没有动画
                imgEl.onload = null;
                imgEl.onerror = null;
                imgEl.src = full.image;
                card.dataset.state = 'loaded';
            } else {
                // 首次加载：走完整三态
                imgEl.onload = () => {
                    card.dataset.state = 'loaded';
                    loadedImages.add(full.image);      // ★ 记入缓存
                };
                imgEl.onerror = () => { card.dataset.state = 'colored'; };
                imgEl.src = full.image;
                card.dataset.state = 'colored';
            }
        } else {
            card.dataset.state = 'colored';
        }
    };

    // 元素回收时重置状态
    card.reset = () => {
        card.dataset.state = 'loading';
        imgEl.onload = null;
        imgEl.onerror = null;
        imgEl.removeAttribute('src');
        imageEl.style.aspectRatio = `${PLACEHOLDER_RATIO}`;
        imageEl.style.background = '';
    };

    return card;
}