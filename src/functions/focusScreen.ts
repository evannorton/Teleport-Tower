import state from "../state";

const focusScreen = (): void => {
    if (state.app !== null) {
        state.app.renderer.view.focus();
    }
};

export default focusScreen;