import Definable from "../../classes/Definable";
import Tilemap from "../../classes/Tilemap";
import Transport from "../../classes/Transport";
import definables from "../../maps/definables";

const defineTransports = (): void => {
    const tilemaps: Map<string, Definable> | undefined = definables.get("Tilemap");
    if (typeof tilemaps !== "undefined") {
        const part1: Definable | undefined = tilemaps.get("part1");
        const part2: Definable | undefined = tilemaps.get("part2");
        if (part1 instanceof Tilemap && part2 instanceof Tilemap) {
            new Transport("to-inside", part2, 27 * 16, 172 * 16);
            new Transport("to-outside", part1, 1 * 16, 137 * 16);
            new Transport("big-fall", part1, 2 * 16, 38 * 16);
            // new Transport("debug", part2, 9 * 16, 2 * 16);
        }
    }
};

export default defineTransports;