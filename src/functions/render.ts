import Definable from "../classes/Definable";
import Player from "../classes/Player";
import definables from "../maps/definables";
import drawRectangle from "./draw/drawRectangle";
import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";
import state from "../state";

const render = (): void => {
    const players: Map<string, Definable> | undefined = definables.get("Player");
    if (state.app !== null && typeof players !== "undefined") {
        state.app.stage.removeChildren();
        drawRectangle("#000000", 0, 0, screenWidth, screenHeight, 1);
        players.forEach((player: Definable): void => {
            if (player instanceof Player) {
                player.render();
            }
        });
        state.app.stage.sortChildren();
        state.app.render();
    }
};

export default render;