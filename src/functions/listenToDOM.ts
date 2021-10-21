import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";
import sizeScreen from "./sizeScreen";
import state from "../state";

const listenToDOM = (): void => {
    addEventListener("beforeunload", (e: Event): void => {
        if (document.body.classList.contains("playing")) {
            e.preventDefault();
            e.returnValue = false;
        }
    });
    addEventListener("resize", (): void => {
        sizeScreen();
    });
    if (state.app !== null) {
        state.app.renderer.view.addEventListener("contextmenu", (e: Event): void => {
            e.preventDefault();
        });
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
        state.app.renderer.view.addEventListener("mousedown", (e: MouseEvent): void => {
            if (e.target instanceof HTMLCanvasElement) {
                if (state.player !== null) {
                    state.player.blink();
                }
                state.mouseHeld = true;
            }
        });
        state.app.renderer.view.addEventListener("mouseup", (e: MouseEvent): void => {
            e.preventDefault();
            if (e.target instanceof HTMLCanvasElement) {
                if (state.player !== null) {
                    state.player.blink();
                    state.player.shoot();
                }
                state.mouseHeld = false;
            }
        });
        state.app.renderer.view.addEventListener("mousemove", (e: MouseEvent): void => {
            if (e.target instanceof HTMLCanvasElement) {
                state.mouseX = e.offsetX / e.target.offsetWidth * screenWidth;
                state.mouseY = e.offsetY / e.target.offsetHeight * screenHeight;
            }
        });
    }
};

export default listenToDOM;