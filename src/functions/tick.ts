import render from "./render";
import state from "../state";
import update from "./update";

const tick = (): void => {
    if (state.app !== null) {
        state.now += state.app.ticker.deltaMS;
        update();
        render();
        state.tickedAt = state.now;
    }
};

export default tick;