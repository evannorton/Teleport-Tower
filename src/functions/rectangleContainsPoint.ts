const rectangleContainsPoint = (rx: number, ry: number, rw: number, rh: number, x: number, y: number): boolean => rx <= x && x <= rx + rw && ry <= y && y <= ry + rh;

export default rectangleContainsPoint;