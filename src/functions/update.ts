import Definable from "../classes/Definable";
import Player from "../classes/Player";
import definables from "../maps/definables";
import state from "../state";

const update = (): void => {
    state.now = performance.now();
    const players: Map<string, Definable> | undefined = definables.get("Player");
    if (typeof players !== "undefined") {
        players.forEach((player: Definable): void => {
            if (player instanceof Player) {
                player.update();
            }
        });
    }
    state.updatedAt = state.now;
};

export default update;