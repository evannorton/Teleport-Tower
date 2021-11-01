import render from "./render";
import state from "../state";
import update from "./update";

const tick = (): void => {
    if (state.app !== null) {
        if (document.body.classList.contains("paused") === false && document.body.classList.contains("loading") === false) {
            state.now += state.app.ticker.deltaMS;
        }
        update();
        render();
        state.tickedAt = state.now;
    }
};

export default tick;