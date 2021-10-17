import Color from "../../types/Color";
import { Graphics } from "pixi.js";
import state from "../../state";

const drawRectangle = (color: Color, x: number, y: number, width: number, height: number, zIndex: number): void => {
    if (state.app !== null) {
        const rectangle: Graphics = new Graphics;
        rectangle.beginFill(Number(`0x${color.substring(1)}`));
        rectangle.lineStyle(0, Number(`0x${color.substring(1)}`));
        rectangle.drawRect(x, y, width, height);
        rectangle.zIndex = zIndex;
        state.app.stage.addChild(rectangle);
    }
};

export default drawRectangle;