import Definable from "../../classes/Definable";
import Music from "../../classes/Music";
import Tilemap from "../../classes/Tilemap";
import definables from "../../maps/definables";

const defineTilemaps = (): void => {
    const music: Map<string, Definable> | undefined = definables.get("Music");
    if (typeof music !== "undefined") {
        const inside: Definable | undefined = music.get("inside");
        if (inside instanceof Music) {
            new Tilemap("part1", inside);
            new Tilemap("part2", inside);
        }
    }
};

export default defineTilemaps;