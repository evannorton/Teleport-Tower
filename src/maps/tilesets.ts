import TiledTileset from "../interfaces/tiled/TiledTileset";
import test from "../tiled/tilesets/test.json";
import wall from "../tiled/tilesets/wall.json";

const tilesets: Map<string, TiledTileset> = new Map;
tilesets.set("test", test);
tilesets.set("wall", wall);

export default tilesets;