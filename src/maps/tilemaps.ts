import TiledTilemap from "../interfaces/tiled/TiledTilemap";
import main from "../tiled/tilemaps/main.json";

const tilemaps: Map<string, TiledTilemap> = new Map;
tilemaps.set("main", main);

export default tilemaps;