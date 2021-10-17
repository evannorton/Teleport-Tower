import Definable from "./Definable";
import TiledTilemap from "../interfaces/tiled/TiledTilemap";
import TiledTilemapLayer from "../interfaces/tiled/TiledTilemapLayer";
import TiledTilemapLayerChunk from "../interfaces/tiled/TiledTilemapLayerChunk";
import TiledTilemapTileset from "../interfaces/tiled/TiledTilemapTileset";
import Tileset from "./Tileset";
import definables from "../maps/definables";
import tilemaps from "../maps/tilemaps";

class Tilemap extends Definable {
    private readonly tiledTilemap: TiledTilemap | null = null;

    public constructor(slug: string) {
        super(slug);
        const tilemap: TiledTilemap | undefined = tilemaps.get(slug);
        if (typeof tilemap !== "undefined") {
            this.tiledTilemap = tilemap;
        }
    }

    public hasCollisionAtCoords(x: number, y: number): boolean {
        const tileIDs: number[] = this.getTilesAtCoords("below", x, y);
        if (tileIDs.length !== 0) {
            const tileID: number = tileIDs[tileIDs.length - 1];
            if (this.tiledTilemap !== null) {
                const tiledTileset: TiledTilemapTileset | undefined = [...this.tiledTilemap.tilesets].reverse().find((tileset: TiledTilemapTileset): boolean => tileset.firstgid <= tileID);
                const tilesets: Map<string, Definable> | undefined = definables.get("Tileset");
                if (typeof tiledTileset !== "undefined" && typeof tilesets !== "undefined") {
                    const tileset: Definable | undefined = tilesets.get(tiledTileset.source.substring(12, tiledTileset.source.lastIndexOf(".json")));
                    if (tileset instanceof Tileset) {
                        return tileset.hasCollisionAtIndex(tileID - tiledTileset.firstgid);
                    }
                }
            }
        }
        return true;
    }

    private getTilesAtCoords(layer: string, x: number, y: number): number[] {
        const tiles: number[] = [];
        if (this.tiledTilemap !== null) {
            const tiledTilemapLayer: TiledTilemapLayer | undefined = this.tiledTilemap.layers.find((tilemapLayer: TiledTilemapLayer): boolean => tilemapLayer.name === layer);
            if (typeof tiledTilemapLayer !== "undefined" && typeof tiledTilemapLayer.layers !== "undefined") {
                tiledTilemapLayer.layers.forEach((tilemapLayer: TiledTilemapLayer): void => {
                    if (typeof tilemapLayer.chunks !== "undefined") {
                        tilemapLayer.chunks.forEach((chunk: TiledTilemapLayerChunk): void => {
                            chunk.data.forEach((tileID: number, key: number): void => {
                                if (x === chunk.x + key % chunk.width && y === chunk.y + Math.floor(key / chunk.width)) {
                                    if (tileID !== 0) {
                                        tiles.push(tileID);
                                    }
                                }
                            });
                        });
                    }
                });
            }
        }
        return tiles;
    }
}

export default Tilemap;