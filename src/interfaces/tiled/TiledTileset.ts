import TiledTilesetTile from "./TiledTilesetTile";

interface TiledTileset {
    imagewidth: number;
    tilecount: number;
    tiles: TiledTilesetTile[];
}

export default TiledTileset;