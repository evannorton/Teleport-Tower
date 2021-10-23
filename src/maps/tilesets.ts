import TiledTileset from "../interfaces/tiled/TiledTileset";
import street from "../tiled/tilesets/street.json";
import transports from "../tiled/tilesets/transports.json";
import wall from "../tiled/tilesets/wall.json";

const tilesets: Map<string, TiledTileset> = new Map;
tilesets.set("street", street);
tilesets.set("transports", transports);
tilesets.set("wall", wall);

export default tilesets;