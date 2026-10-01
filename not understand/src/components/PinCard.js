import { ICONS } from '../icons/index.js';

export function PinCard(data) {
    const card = document.createElement('article');
    card.className = 'pin-card';
    card.dataset.id = data.id;

    card.innerHTML = `
        <div class="pin-card__image" style="aspect-ratio: ${data.width} / ${data.height};">
            <img src="${data.image}" alt="${data.title ?? ''}" loading="lazy">
        </div>
        <div class="pin-card__overlay">
            <button class="pin-card__save" type="button">保存</button>
            <div class="pin-card__actions">
                <button class="pin-card__action" type="button" aria-label="分享">${ICONS.share}</button>
                <button class="pin-card__action" type="button" aria-label="更多">${ICONS.more}</button>
            </div>
        </div>
    `;

    return card;
}