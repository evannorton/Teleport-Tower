import Definable from "../classes/Definable";
import Player from "../classes/Player";
import Projectile from "../classes/Projectile";
import definables from "../maps/definables";
import state from "../state";
import ticksPerSecond from "../constants/ticksPerSecond";

const update = (): void => {
    state.now += 1000 / ticksPerSecond;
    const players: Map<string, Definable> | undefined = definables.get("Player");
    const projectiles: Map<string, Definable> | undefined = definables.get("Projectile");
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
    state.updatedAt = state.now;
};

export default update;