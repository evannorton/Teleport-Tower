import { Application, Loader, SCALE_MODES, settings, utils } from "pixi.js";
import Player from "../classes/Player";
import define from "./define/define";
import focusScreen from "./focusScreen";
import listenToDOM from "./listenToDOM";
import screen from "../elements/screen";
import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";
import sizeScreen from "./sizeScreen";
import state from "../state";
import tick from "./tick";

const run = (): void => {
    console.log("running Foddian");
    window.ngio.getValidSession((): void => {
        define();
        settings.ROUND_PIXELS = true;
        settings.SCALE_MODE = SCALE_MODES.NEAREST;
        utils.skipHello();
        state.app = new Application({
            backgroundAlpha: 0,
            height: screenHeight,
            width: screenWidth
        });
        state.app.renderer.view.style.display = "block";
        state.app.renderer.view.style.height = "100%";
        state.app.renderer.view.style.width = "100%";
        state.app.renderer.view.tabIndex = 0;
        if (screen !== null) {
            screen.appendChild(state.app.view);
        }
        sizeScreen();
        const loader: Loader = new Loader;
        loader.add("./fonts/RetroPixels.fnt").load((): void => {
            state.fontLoaded = true;
        });
        listenToDOM();
        state.player = new Player;
        state.app.ticker.add(tick);
        focusScreen();
    });
};

export default run;