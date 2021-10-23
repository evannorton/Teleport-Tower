import Cutscene from "../classes/Cutscene";
import Definable from "../classes/Definable";
import Player from "../classes/Player";
import Projectile from "../classes/Projectile";
import definables from "../maps/definables";
import state from "../state";
import step from "../constants/step";

const update = (): void => {
    const currentTime: number = performance.now();
    state.deltaTime += currentTime - state.updatedAt;
    state.updatedAt = currentTime;
    const maxStepsPerLoop: number = 10;
    let stepCount: number = 0;
    while (state.deltaTime >= step) {
        const cutscenes: Map<string, Definable> | undefined = definables.get("Cutscene");
        const players: Map<string, Definable> | undefined = definables.get("Player");
        const projectiles: Map<string, Definable> | undefined = definables.get("Projectile");
        if (typeof cutscenes !== "undefined") {
            cutscenes.forEach((cutscene: Definable): void => {
                if (cutscene instanceof Cutscene) {
                    cutscene.update();
                }
            });
        }
        if (typeof players !== "undefined") {
            players.forEach((player: Definable): void => {
                if (player instanceof Player) {
                    player.update();
                }
            });
        }
        if (typeof projectiles !== "undefined") {
            projectiles.forEach((projectile: Definable): void => {
                if (projectile instanceof Projectile) {
                    projectile.update();
                }
            });
        }
        state.deltaTime -= step;
        state.now += step;
        stepCount++;
        if (stepCount >= maxStepsPerLoop) {
            break;
        }
    }
};

export default update;