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

    // ★ 滚动时收起/展开
    let lastY = window.scrollY;
    const THRESHOLD = 8;   // 防抖：滚动超过 8px 才切换

    function onScroll() {
        const y = window.scrollY;

        // 顶部不动：如果已经贴到顶栏了，就不隐藏
        if (y <= 0) {
            bar.classList.remove('is-hidden');
        } else if (y > lastY + THRESHOLD) {
            bar.classList.add('is-hidden');      // 向下 → 藏起来
        } else if (y < lastY - THRESHOLD) {
            bar.classList.remove('is-hidden');   // 向上 → 露出来
        }

        lastY = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // 组件销毁时可以清理（后面做多页路由会用得上）
    bar.destroy = () => window.removeEventListener('scroll', onScroll);

    return bar;
}