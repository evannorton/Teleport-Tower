import TiledTileset from "../interfaces/tiled/TiledTileset";
import test from "../tiled/tilesets/test.json";

const tilesets: Map<string, TiledTileset> = new Map;
tilesets.set("test", test);

export default tilesets;