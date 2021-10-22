import TiledTileset from "../interfaces/tiled/TiledTileset";
import street from "../tiled/tilesets/street.json";
import wall from "../tiled/tilesets/wall.json";

const tilesets: Map<string, TiledTileset> = new Map;
tilesets.set("street", street);
tilesets.set("wall", wall);

export default tilesets;