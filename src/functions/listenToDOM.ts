import AudioSource from "../classes/AudioSource";
import Definable from "../classes/Definable";
import definables from "../maps/definables";
import focusScreen from "./focusScreen";
import interact from "./interact";
import mute from "../elements/mute";
import pause from "../elements/pause";
import pauseMenu from "../elements/pauseMenu";
import reset from "./reset";
import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";
import sizeScreen from "./sizeScreen";
import state from "../state";
import takeScreenshot from "./takeScreenshot";
import togglePause from "./togglePause";
import unpause from "../elements/unpause";

const listenToDOM = (): void => {
    addEventListener("beforeunload", (e: Event): void => {
        e.preventDefault();
        e.returnValue = false;
    });
    addEventListener("resize", (): void => {
        sizeScreen();
    });
    if (pauseMenu !== null) {
        pauseMenu.addEventListener("click", (): void => {
            focusScreen();
        });
    }
    if (mute !== null) {
        mute.addEventListener("change", (): void => {
            const audio: Map<string, Definable> | undefined = definables.get("AudioSource");
            if (typeof audio !== "undefined") {
                audio.forEach((source: Definable): void => {
                    if (source instanceof AudioSource) {
                        source.toggleMute();
                    }
                });
            }
            focusScreen();
        });
    }
    if (pause !== null) {
        pause.addEventListener("click", (): void => {
            togglePause();
        });
    }
    if (unpause !== null) {
        unpause.addEventListener("click", (): void => {
            togglePause();
        });
    }
    if (state.app !== null) {
        state.app.renderer.view.addEventListener("contextmenu", (e: Event): void => {
            e.preventDefault();
        });
        state.app.renderer.view.addEventListener("keydown", (e: KeyboardEvent): void => {
            interact();
            const key: string = e.key.toLowerCase();
            switch (key) {
                case " ":
                case "enter":
                case "escape":
                    togglePause();
                    break;
                case "m": {
                    const audio: Map<string, Definable> | undefined = definables.get("AudioSource");
                    if (typeof audio !== "undefined") {
                        audio.forEach((source: Definable): void => {
                            if (source instanceof AudioSource) {
                                source.toggleMute();
                            }
                        });
                    }
                    if (mute instanceof HTMLInputElement) {
                        mute.checked = mute.checked === false;
                    }
                    break;
                }
                case "p":
                    takeScreenshot();
                    break;
                case "r":
                    if (e.shiftKey) {
                        reset();
                    }
                    break;
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
            state.mouseHeldAt = null;
        });
        state.app.renderer.view.addEventListener("selectstart", (e: Event): void => {
            e.preventDefault();
        });
        state.app.renderer.view.addEventListener("mousedown", (e: MouseEvent): void => {
            interact();
            if (e.target instanceof HTMLCanvasElement) {
                if (state.player !== null) {
                    state.player.blink();
                }
                state.mouseHeldAt = state.now;
            }
        });
        addEventListener("mouseup", (e: MouseEvent): void => {
            e.preventDefault();
            if (state.app !== null && state.app.renderer.view instanceof HTMLCanvasElement) {
                if (state.player !== null) {
                    state.player.blink();
                    state.player.shoot();
                }
                state.mouseHeldAt = null;
                const audio: Map<string, Definable> | undefined = definables.get("AudioSource");
                if (typeof audio !== "undefined") {
                    const charge: Definable | undefined = audio.get("sfx/charge");
                    if (charge instanceof AudioSource) {
                        charge.stop();
                    }
                }
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