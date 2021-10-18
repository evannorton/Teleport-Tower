const rectanglesOverlap = (x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean => {
    const aLeftOfB: boolean = x1 + w1 < x2;
    const aRightOfB: boolean = x1 > x2 + w2;
    const aAboveB: boolean = y1 > y2 + h2;
    const aBelowB: boolean = y1 + h1 < y2;
    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
};

export default rectanglesOverlap;