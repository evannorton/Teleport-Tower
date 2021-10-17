import TiledTilemapLayerChunk from "./TiledTilemapLayerChunk";

interface TiledTilemapLayer {
    chunks?: TiledTilemapLayerChunk[];
    layers?: TiledTilemapLayer[];
    name: string;
}

export default TiledTilemapLayer;