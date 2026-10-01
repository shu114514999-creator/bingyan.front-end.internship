export const mockPins = Array.from({ length: 30 }, (_, i) => {
    const width = 400;
    const height = [400, 500, 550, 600, 620, 680, 720][i % 7];
    return {
        id: i + 1,
        image: `https://picsum.photos/seed/p${i + 1}/${width}/${height}`,
        width,
        height,
        title: `示例图片 ${i + 1}`
    };
});