import Background from "../classes/Background";
import { BitmapText } from "@pixi/text-bitmap";
import Cutscene from "../classes/Cutscene";
import Definable from "../classes/Definable";
import Player from "../classes/Player";
import Projectile from "../classes/Projectile";
import Tilemap from "../classes/Tilemap";
import definables from "../maps/definables";
import drawRectangle from "./draw/drawRectangle";
import getRunTime from "./getRunTime";
import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";
import state from "../state";

const render = (): void => {
    const backgrounds: Map<string, Definable> | undefined = definables.get("Background");
    const cutscenes: Map<string, Definable> | undefined = definables.get("Cutscene");
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
        if (typeof backgrounds !== "undefined") {
            backgrounds.forEach((background: Definable): void => {
                if (background instanceof Background) {
                    background.render();
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
        if (typeof cutscenes !== "undefined") {
            cutscenes.forEach((cutscene: Definable): void => {
                if (cutscene instanceof Cutscene) {
                    cutscene.render();
                }
            });
        }
        if (state.fontLoaded && state.cutscene === null) {
            const sprite: BitmapText = new BitmapText(getRunTime(), {
                align: "right",
                fontName: "RetroPixels",
                fontSize: 16,
                tint: state.player !== null && state.player.getMap() === "part1" ? Number(`0x000000`) : Number(`0xffffff`)
            });
            sprite.x = screenWidth - 22;
            sprite.y = 7;
            sprite.anchor.set(0, 0);
            sprite.zIndex = 10;
            sprite.pivot.x = sprite.textWidth;
            state.app.stage.addChild(sprite);
        }
        state.app.stage.sortChildren();
        state.app.render();
    }
};

export default render;