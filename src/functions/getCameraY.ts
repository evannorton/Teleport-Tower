import screenHeight from "../constants/screenHeight";
import state from "../state";

const getCameraY = (): number => {
    if (state.player !== null) {
        return state.player.getY() + state.player.getHeight() / 2 - screenHeight / 2;
    }
    return 0;
};

export default getCameraY;