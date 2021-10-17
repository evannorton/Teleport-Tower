import Coordinate from "../interfaces/Coordinate";
import Definable from "./Definable";
import Renderable from "../interfaces/Renderable";
import TiledTilemap from "../interfaces/tiled/TiledTilemap";
import TiledTilemapLayer from "../interfaces/tiled/TiledTilemapLayer";
import TiledTilemapLayerChunk from "../interfaces/tiled/TiledTilemapLayerChunk";
import TiledTilemapTileset from "../interfaces/tiled/TiledTilemapTileset";
import Tileset from "./Tileset";
import definables from "../maps/definables";
import drawImage from "../functions/draw/drawImage";
import getCameraX from "../functions/getCameraX";
import getCameraY from "../functions/getCameraY";
import rectangleContainsPoint from "../functions/rectangleContainsPoint";
import state from "../state";
import tileHeight from "../constants/tileHeight";
import tileWidth from "../constants/tileWidth";
import tilemaps from "../maps/tilemaps";

class Tilemap extends Definable implements Renderable {
    private readonly tiledTilemap: TiledTilemap | null = null;

    public constructor(slug: string) {
        super(slug);
        const tilemap: TiledTilemap | undefined = tilemaps.get(slug);
        if (typeof tilemap !== "undefined") {
            this.tiledTilemap = tilemap;
        }
    }

    public hasCollisionAtCoordinate(coordinate: Coordinate): boolean {
        const matches: number[] = [];
        if (this.tiledTilemap !== null) {
            this.tiledTilemap.layers.forEach((layer: TiledTilemapLayer): void => {
                switch (layer.name) {
                    case "below":
                        if (typeof layer.layers !== "undefined") {
                            layer.layers.forEach((innerLayer: TiledTilemapLayer): void => {
                                if (typeof innerLayer.chunks !== "undefined") {
                                    innerLayer.chunks.forEach((chunk: TiledTilemapLayerChunk): void => {
                                        chunk.data.forEach((datum: number, key: number): void => {
                                            const tileID: number = datum - 1;
                                            if (this.tiledTilemap !== null) {
                                                const tiledTileset: TiledTilemapTileset | undefined = [...this.tiledTilemap.tilesets].reverse().find((tileset: TiledTilemapTileset): boolean => tileset.firstgid <= datum);
                                                if (typeof tiledTileset !== "undefined") {
                                                    const tilesets: Map<string, Definable> | undefined = definables.get("Tileset");
                                                    if (typeof tilesets !== "undefined") {
                                                        const tileset: Definable | undefined = tilesets.get(tiledTileset.source.substring(12, tiledTileset.source.lastIndexOf(".json")));
                                                        if (tileset instanceof Tileset) {
                                                            const x: number = (chunk.x + key % chunk.width) * tileWidth;
                                                            const y: number = (chunk.y + Math.floor(key / chunk.width)) * tileHeight;
                                                            if (tileset.hasCollisionAtTile(tileID) && rectangleContainsPoint(x, y, tileWidth, tileHeight, coordinate.x, coordinate.y)) {
                                                                matches.push(tileID);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    });
                                }
                            });
                        }
                        break;
                }
            });
        }
        return matches.length > 0;
    }

    public render(): void {
        if (this.tiledTilemap !== null && state.player !== null && state.player.isOnMap(this.slug)) {
            this.tiledTilemap.layers.forEach((layer: TiledTilemapLayer): void => {
                switch (layer.name) {
                    case "below":
                        if (typeof layer.layers !== "undefined") {
                            layer.layers.forEach((innerLayer: TiledTilemapLayer): void => {
                                if (typeof innerLayer.chunks !== "undefined") {
                                    innerLayer.chunks.forEach((chunk: TiledTilemapLayerChunk): void => {
                                        chunk.data.forEach((datum: number, key: number): void => {
                                            const tileID: number = datum - 1;
                                            if (this.tiledTilemap !== null) {
                                                const tiledTileset: TiledTilemapTileset | undefined = [...this.tiledTilemap.tilesets].reverse().find((tileset: TiledTilemapTileset): boolean => tileset.firstgid <= datum);
                                                if (typeof tiledTileset !== "undefined") {
                                                    const tilesets: Map<string, Definable> | undefined = definables.get("Tileset");
                                                    if (typeof tilesets !== "undefined") {
                                                        const tileset: Definable | undefined = tilesets.get(tiledTileset.source.substring(12, tiledTileset.source.lastIndexOf(".json")));
                                                        if (tileset instanceof Tileset) {
                                                            const x: number = (chunk.x + key % chunk.width) * tileWidth;
                                                            const y: number = (chunk.y + Math.floor(key / chunk.width)) * tileHeight;
                                                            const tileX: number | null = tileset.getTileX(tileID);
                                                            const tileY: number | null = tileset.getTileY(tileID);
                                                            if (tileX !== null && tileY !== null) {
                                                                drawImage(tileset.getImage(), tileX * tileWidth, tileY * tileHeight, tileWidth, tileHeight, x - getCameraX(), y - getCameraY(), tileWidth, tileHeight, 2);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    });
                                }
                            });
                        }
                        break;
                }
            });
        }
    }
}

export default Tilemap;