import TiledTilemapLayer from "./TiledTilemapLayer";
import TiledTilemapTileset from "./TiledTilemapTileset";

interface TiledTilemap {
    height: number;
    layers: TiledTilemapLayer[];
    tilesets: TiledTilemapTileset[];
}

export default TiledTilemap;