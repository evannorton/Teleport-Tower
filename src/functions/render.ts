import drawRectangle from "./draw/drawRectangle";
import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";
import state from "../state";

const render = (): void => {
    if (state.app !== null) {
        state.app.stage.removeChildren();
        drawRectangle("#000000", 0, 0, screenWidth, screenHeight, 1);
        state.app.stage.sortChildren();
        state.app.render();
    }
};

export default render;