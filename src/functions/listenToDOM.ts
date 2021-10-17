import sizeScreen from "./sizeScreen";
import state from "../state";

const listenToDOM = (): void => {
    addEventListener("resize", (): void => {
        sizeScreen();
    });
    if (state.app !== null) {
        state.app.renderer.view.addEventListener("keydown", (e: KeyboardEvent): void => {
            const key: string = e.key.toLowerCase();
            switch (key) {
                case "tab":
                    e.preventDefault();
                    break;
            }
            if (state.heldKeys.includes(key) === false) {
                state.heldKeys.push(key);
            }
        });
        state.app.renderer.view.addEventListener("keyup", (e: KeyboardEvent): void => {
            const key: string = e.key.toLowerCase();
            if (state.heldKeys.includes(key)) {
                state.heldKeys.splice(state.heldKeys.indexOf(key), 1);
            }
        });
        state.app.renderer.view.addEventListener("focusout", (): void => {
            state.heldKeys = [];
        });
        state.app.renderer.view.addEventListener("selectstart", (e: Event): void => {
            e.preventDefault();
        });
    }
};

export default listenToDOM;