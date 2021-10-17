import Definable from "../classes/Definable";
import Player from "../classes/Player";
import definables from "../maps/definables";

const update = (): void => {
    const players: Map<string, Definable> | undefined = definables.get("Player");
    if (typeof players !== "undefined") {
        players.forEach((player: Definable): void => {
            if (player instanceof Player) {
                player.update();
            }
        });
    }
};

export default update;