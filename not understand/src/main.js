import './styles/main.scss';
import { Sidebar } from './components/Sidebar.js';
import { Topbar } from './components/Topbar.js';
import { FilterBar } from './components/FilterBar.js';
import { PinGrid } from './components/PinGrid.js';
import { mockPins } from './data/mockPins.js';

const app = document.getElementById('app');

app.appendChild(Sidebar({
    onNavigate: (key) => console.log('导航到:', key)
}));
app.appendChild(Topbar({
    onSearch: (q) => console.log('搜索:', q)
}));

const main = document.createElement('main');
main.className = 'main-content';

main.appendChild(FilterBar({
    items: ['全部', '时尚', '家居', '美食', '旅行', '婚礼', '艺术', '健身'],
    onChange: (label) => console.log('切换分类:', label)
}));

const grid = PinGrid({ items: mockPins });
main.appendChild(grid);

let loadCount = 0;
const sentinel = document.createElement('div');
sentinel.style.height = '1px';
main.appendChild(sentinel);

const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && loadCount < 5) {
        loadCount++;
        const more = mockPins.map((p, i) => ({
            ...p,
            id: p.id + 1000 * loadCount,
            image: `https://picsum.photos/seed/load${loadCount}_${i}/${p.width}/${p.height}`
        }));
        grid.appendItems(more);
    }
}, { rootMargin: '600px' });
io.observe(sentinel);

app.appendChild(main);