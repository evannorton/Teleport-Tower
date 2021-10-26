import Definable from "../classes/Definable";
import TiledTilemap from "../interfaces/tiled/TiledTilemap";
import Tilemap from "../classes/Tilemap";
import definables from "../maps/definables";
import screenHeight from "../constants/screenHeight";
import state from "../state";

const getCameraY = (): number => {
    if (state.cutscene === "outro") {
        return -64;
    }
    const tilemaps: Map<string, Definable> | undefined = definables.get("Tilemap");
    if (state.player !== null && typeof tilemaps !== "undefined") {
        const map: string = state.player.getMap();
        const tilemap: Definable | undefined = tilemaps.get(map);
        if (tilemap instanceof Tilemap) {
            const tiledMap: TiledTilemap | null = tilemap.getTiledTilemap();
            if (tiledMap !== null) {
                return Math.min((tiledMap.height - 22) * 16, Math.round(state.player.getY()) + state.player.getHeight() / 2 - screenHeight / 2);
            }
        }
    }
    return 0;
};

export default getCameraY;