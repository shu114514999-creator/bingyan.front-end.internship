export function FilterBar({ items = [], onChange } = {}) {
    const bar = document.createElement('div');
    bar.className = 'filter-bar';

    items.forEach((label, i) => {
        const chip = document.createElement('button');
        chip.className = 'filter-chip' + (i === 0 ? ' active' : '');
        chip.type = 'button';
        chip.textContent = label;

        chip.addEventListener('click', () => {
            bar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            onChange?.(label);
        });

        bar.appendChild(chip);
    });

    return bar;
}