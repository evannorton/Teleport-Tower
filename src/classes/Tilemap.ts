import Definable from "./Definable";
import Renderable from "../interfaces/Renderable";
import TiledTilemap from "../interfaces/tiled/TiledTilemap";
import TiledTilemapLayer from "../interfaces/tiled/TiledTilemapLayer";
import TiledTilemapLayerChunk from "../interfaces/tiled/TiledTilemapLayerChunk";
import TiledTilemapTileset from "../interfaces/tiled/TiledTilemapTileset";
import Tileset from "./Tileset";
import Transport from "./Transport";
import definables from "../maps/definables";
import drawImage from "../functions/draw/drawImage";
import getCameraX from "../functions/getCameraX";
import getCameraY from "../functions/getCameraY";
import rectanglesOverlap from "../functions/rectanglesOverlap";
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

    public getTiledTilemap(): TiledTilemap | null {
        return this.tiledTilemap;
    }

    public getTransportInRectangle(x: number, y: number, width: number, height: number): Transport | null {
        if (this.tiledTilemap !== null) {
            for (const layer of this.tiledTilemap.layers) {
                switch (layer.name) {
                    case "transports":
                        if (typeof layer.chunks !== "undefined") {
                            for (const chunk of layer.chunks) {
                                if (rectanglesOverlap(x - 1, y - 1, width + 2, height + 2, chunk.x * 16, chunk.y * 16, chunk.width * 16, chunk.height * 16)) {
                                    let key: number = 0;
                                    for (const datum of chunk.data) {
                                        const tiledTileset: TiledTilemapTileset | undefined = [...this.tiledTilemap.tilesets].reverse().find((tileset: TiledTilemapTileset): boolean => tileset.firstgid <= datum);
                                        if (typeof tiledTileset !== "undefined") {
                                            const tileID: number = datum - tiledTileset.firstgid;
                                            const tilesets: Map<string, Definable> | undefined = definables.get("Tileset");
                                            if (typeof tilesets !== "undefined") {
                                                const tileset: Definable | undefined = tilesets.get(tiledTileset.source.substring(12, tiledTileset.source.lastIndexOf(".json")));
                                                if (tileset instanceof Tileset) {
                                                    const tileX: number = (chunk.x + key % chunk.width) * tileWidth;
                                                    const tileY: number = (chunk.y + Math.floor(key / chunk.width)) * tileHeight;
                                                    if (rectanglesOverlap(tileX, tileY, tileWidth, tileHeight, x, y, width, height)) {
                                                        return tileset.getTransportAtTile(tileID);
                                                    }
                                                }
                                            }
                                        }
                                        key++;
                                    }
                                }
                            }
                        }
                        break;
                }
            }
        }
        return null;
    }

    public hasCollisionInRectangle(x: number, y: number, width: number, height: number): boolean {
        if (this.tiledTilemap !== null) {
            for (const layer of this.tiledTilemap.layers) {
                switch (layer.name) {
                    case "below":
                        if (typeof layer.layers !== "undefined") {
                            for (const innerLayer of layer.layers) {
                                if (typeof innerLayer.chunks !== "undefined") {
                                    for (const chunk of innerLayer.chunks) {
                                        if (rectanglesOverlap(x - 1, y - 1, width + 2, height + 2, chunk.x * 16, chunk.y * 16, chunk.width * 16, chunk.height * 16)) {
                                            let key: number = 0;
                                            for (const datum of chunk.data) {
                                                const tiledTileset: TiledTilemapTileset | undefined = [...this.tiledTilemap.tilesets].reverse().find((tileset: TiledTilemapTileset): boolean => tileset.firstgid <= datum);
                                                if (typeof tiledTileset !== "undefined") {
                                                    const tileID: number = datum - tiledTileset.firstgid;
                                                    const tilesets: Map<string, Definable> | undefined = definables.get("Tileset");
                                                    if (typeof tilesets !== "undefined") {
                                                        const tileset: Definable | undefined = tilesets.get(tiledTileset.source.substring(12, tiledTileset.source.lastIndexOf(".json")));
                                                        if (tileset instanceof Tileset) {
                                                            const tileX: number = (chunk.x + key % chunk.width) * tileWidth;
                                                            const tileY: number = (chunk.y + Math.floor(key / chunk.width)) * tileHeight;
                                                            if (tileset.hasCollisionAtTile(tileID) && rectanglesOverlap(tileX, tileY, tileWidth, tileHeight, x, y, width, height)) {
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                }
                                                key++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        break;
                }
            }
        }
        return false;
    }

    public render(): void {
        if (this.tiledTilemap !== null && state.player !== null && state.player.isOnMap(this.slug)) {
            this.tiledTilemap.layers.forEach((layer: TiledTilemapLayer): void => {
                switch (layer.name) {
                    case "above":
                        if (typeof layer.layers !== "undefined") {
                            layer.layers.forEach((innerLayer: TiledTilemapLayer): void => {
                                if (typeof innerLayer.chunks !== "undefined") {
                                    innerLayer.chunks.forEach((chunk: TiledTilemapLayerChunk): void => {
                                        chunk.data.forEach((datum: number, key: number): void => {
                                            if (this.tiledTilemap !== null) {
                                                const tiledTileset: TiledTilemapTileset | undefined = [...this.tiledTilemap.tilesets].reverse().find((tileset: TiledTilemapTileset): boolean => tileset.firstgid <= datum);
                                                if (typeof tiledTileset !== "undefined") {
                                                    const tileID: number = datum - tiledTileset.firstgid;
                                                    const tilesets: Map<string, Definable> | undefined = definables.get("Tileset");
                                                    if (typeof tilesets !== "undefined") {
                                                        const tileset: Definable | undefined = tilesets.get(tiledTileset.source.substring(12, tiledTileset.source.lastIndexOf(".json")));
                                                        if (tileset instanceof Tileset) {
                                                            const x: number = (chunk.x + key % chunk.width) * tileWidth;
                                                            const y: number = (chunk.y + Math.floor(key / chunk.width)) * tileHeight;
                                                            const tileX: number | null = tileset.getTileX(tileID);
                                                            const tileY: number | null = tileset.getTileY(tileID);
                                                            if (tileX !== null && tileY !== null) {
                                                                drawImage(tileset.getImage(), tileX * tileWidth, tileY * tileHeight, tileWidth, tileHeight, x - getCameraX(), y - getCameraY(), tileWidth, tileHeight, 7);
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
                    case "below":
                        if (typeof layer.layers !== "undefined") {
                            layer.layers.forEach((innerLayer: TiledTilemapLayer): void => {
                                if (typeof innerLayer.chunks !== "undefined") {
                                    innerLayer.chunks.forEach((chunk: TiledTilemapLayerChunk): void => {
                                        chunk.data.forEach((datum: number, key: number): void => {
                                            if (this.tiledTilemap !== null) {
                                                const tiledTileset: TiledTilemapTileset | undefined = [...this.tiledTilemap.tilesets].reverse().find((tileset: TiledTilemapTileset): boolean => tileset.firstgid <= datum);
                                                if (typeof tiledTileset !== "undefined") {
                                                    const tileID: number = datum - tiledTileset.firstgid;
                                                    const tilesets: Map<string, Definable> | undefined = definables.get("Tileset");
                                                    if (typeof tilesets !== "undefined") {
                                                        const tileset: Definable | undefined = tilesets.get(tiledTileset.source.substring(12, tiledTileset.source.lastIndexOf(".json")));
                                                        if (tileset instanceof Tileset) {
                                                            const x: number = (chunk.x + key % chunk.width) * tileWidth;
                                                            const y: number = (chunk.y + Math.floor(key / chunk.width)) * tileHeight;
                                                            const tileX: number | null = tileset.getTileX(tileID);
                                                            const tileY: number | null = tileset.getTileY(tileID);
                                                            if (tileX !== null && tileY !== null) {
                                                                drawImage(tileset.getImage(), tileX * tileWidth, tileY * tileHeight, tileWidth, tileHeight, x - getCameraX(), y - getCameraY(), tileWidth, tileHeight, 3);
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