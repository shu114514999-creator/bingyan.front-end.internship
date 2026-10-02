export const mockPins = Array.from({ length: 30 }, (_, i) => {
    const width = 400;
    const height = [400, 500, 550, 600, 620, 680, 720][i % 7];
    const hasLink = i % 3 !== 0;

    return {
        id: i + 1,
        image: `https://picsum.photos/seed/p${i + 1}/${width}/${height}`,
        width,
        height,
        title: `示例图片 ${i + 1} - Retro Japanese Black Cat Japandi Poster`,
        // 描述（长文本，用来看 See more 效果）
        description:
            'Retro Japanese Black Cat Japanese Animal Poster. High quality resin-coated photo base paper. ' +
            'Satin photo finish, maximum color gamut, dmax, and image resolution. Perfect for modern Japandi ' +
            'interiors, gift for animal lovers, or a statement piece for your living room wall.',
        // 商品字段
        shop: 'Penpoo Store',
        shopUrl: '#',
        price: 17.99 + i,
        oldPrice: 21.59 + i,
        rating: 4 + (i % 10) / 10,     // 4.0 ~ 4.9
        ratingCount: 20 + i * 5,
        reactions: 6 + i,
        link: hasLink ? `https://example.com/pin/${i + 1}` : undefined
    };
});