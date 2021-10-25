import TiledTileset from "../interfaces/tiled/TiledTileset";
import clouds from "../tiled/tilesets/clouds.json";
import python from "../tiled/tilesets/python.json";
import street from "../tiled/tilesets/street.json";
import transports from "../tiled/tilesets/transports.json";
import wall from "../tiled/tilesets/wall.json";

const tilesets: Map<string, TiledTileset> = new Map;
tilesets.set("clouds", clouds);
tilesets.set("python", python);
tilesets.set("street", street);
tilesets.set("transports", transports);
tilesets.set("wall", wall);

export default tilesets;