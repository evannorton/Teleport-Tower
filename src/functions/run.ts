import { Application, SCALE_MODES, settings, utils } from "pixi.js";
import Player from "../classes/Player";
import define from "./define/define";
import listenToDOM from "./listenToDOM";
import render from "./render";
import screen from "../elements/screen";
import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";
import sizeScreen from "./sizeScreen";
import state from "../state";

const run = (): void => {
    console.log("running Foddian");
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
    listenToDOM();
    state.player = new Player;
    state.app.ticker.add(render);
};

export default run;