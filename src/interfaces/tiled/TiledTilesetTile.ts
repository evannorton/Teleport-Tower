import TiledTilesetTileAnimation from "./TiledTilesetTileAnimation";
import TiledTilesetTileProperty from "./TiledTilesetTileProperty";

interface TiledTilesetTile {
    animation?: TiledTilesetTileAnimation[];
    id: number;
    properties?: TiledTilesetTileProperty[];
}

export default TiledTilesetTile;