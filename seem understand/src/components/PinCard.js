import { ICONS } from '../icons/index.js';

export function PinCard(data) {
    const card = document.createElement('article');
    card.className = 'pin-card';
    card.dataset.id = data.id;

    const hasLink = Boolean(data.link);
    const href = `/pin/${data.id}`;

    card.innerHTML = `
        <a class="pin-card__link" href="${href}" aria-label="${data.title ?? ''}">
            <div class="pin-card__image" style="aspect-ratio: ${data.width} / ${data.height};">
                <img src="${data.image}" alt="${data.title ?? ''}" loading="lazy">
            </div>
        </a>
        <div class="pin-card__overlay">
            <button class="pin-card__save" type="button">保存</button>
            <div class="pin-card__bottom">
                ${hasLink
            ? `<a class="pin-card__visit" href="${data.link}" target="_blank" rel="noopener noreferrer">Visit site</a>`
            : '<span></span>'}
                <div class="pin-card__actions">
                    <button class="pin-card__action" type="button" aria-label="分享">${ICONS.share}</button>
                    <button class="pin-card__action" type="button" aria-label="更多操作">${ICONS.more}</button>
                </div>
            </div>
        </div>
    `;

    return card;
}