import TiledTilemap from "../interfaces/tiled/TiledTilemap";
import part1 from "../tiled/tilemaps/part1.json";
import part2 from "../tiled/tilemaps/part2.json";

const tilemaps: Map<string, TiledTilemap> = new Map;
tilemaps.set("part1", part1);
tilemaps.set("part2", part2);

export default tilemaps;