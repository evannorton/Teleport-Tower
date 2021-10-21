import Definable from "../classes/Definable";
import Player from "../classes/Player";
import Projectile from "../classes/Projectile";
import Tilemap from "../classes/Tilemap";
import definables from "../maps/definables";
import drawRectangle from "./draw/drawRectangle";
import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";
import state from "../state";

const render = (): void => {
    const players: Map<string, Definable> | undefined = definables.get("Player");
    const projectiles: Map<string, Definable> | undefined = definables.get("Projectile");
    const tilemaps: Map<string, Definable> | undefined = definables.get("Tilemap");
    if (state.app !== null) {
        state.app.stage.removeChildren();
        drawRectangle("#000000", 0, 0, screenWidth, screenHeight, 1);
        if (typeof tilemaps !== "undefined") {
            tilemaps.forEach((tilemap: Definable): void => {
                if (tilemap instanceof Tilemap) {
                    tilemap.render();
                }
            });
        }
        if (typeof players !== "undefined") {
            players.forEach((player: Definable): void => {
                if (player instanceof Player) {
                    player.render();
                }
            });
        }
        if (typeof projectiles !== "undefined") {
            projectiles.forEach((projectile: Definable): void => {
                if (projectile instanceof Projectile) {
                    projectile.render();
                }
            });
        }
        state.app.stage.sortChildren();
        state.app.render();
    }
};

export default render;