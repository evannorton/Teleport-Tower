import TiledTilemapLayer from "./TiledTilemapLayer";
import TiledTilemapTileset from "./TiledTilemapTileset";

interface TiledTilemap {
    layers: TiledTilemapLayer[];
    tilesets: TiledTilemapTileset[];
}

export default TiledTilemap;