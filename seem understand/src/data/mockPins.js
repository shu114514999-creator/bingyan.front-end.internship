const CREATORS = ['Mael Bernabedabriou', '李明', 'Alice Chen', '张伟', 'Sakura'];
const TITLES = [
    'Kobeni Phone Wallpaper',
    '极简家居设计灵感',
    '北欧风房间布置',
    '日系甜品摆盘',
    '山间旅行的第一缕晨光',
    '极简主义婚礼布置',
    '手绘插画日常',
    '健身房的一角'
];

export const mockPins = Array.from({ length: 30 }, (_, i) => {
    const width = 400;
    const height = [400, 500, 550, 600, 620, 680, 720][i % 7];
    const hasLink = i % 3 !== 0;

    const baseComments = [
        { author: 'Milk', text: '很好看，收藏了！' },
        { author: 'Coffee', text: '这个配色太棒了' },
        { author: 'Tea', text: '请问这是哪里呀' }
    ];
    const comments = i % 3 === 0 ? [] : baseComments.slice(0, (i % 3) + 1);

    return {
        id: i + 1,
        image: `https://picsum.photos/seed/p${i + 1}/${width}/${height}`,
        width,
        height,
        title: TITLES[i % TITLES.length],
        description: '这是一段示例描述文字，用来展示 Pin 详情页的说明区域。可以包含图片的来源、灵感思路、制作过程等信息。',
        link: hasLink ? `https://example.com/pin/${i + 1}` : undefined,
        creator: CREATORS[i % CREATORS.length],
        reactions: 100 + (i * 37) % 900,
        comments,
        creatorUrl: `/user/${i % CREATORS.length}`,   // 创作者主页 URL
        dominantColor: `hsl(${(i * 47) % 360}, 60%, 70%)`, // 图片主色占位（真实是从图里取）
        // aiModified: i % 7 === 0,                    // 偶尔标一下，可选
    };
});