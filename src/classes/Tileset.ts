import Definable from "./Definable";
import ImageSource from "./ImageSource";
import TiledTileset from "../interfaces/tiled/TiledTileset";
import TiledTilesetTileProperty from "../interfaces/tiled/TiledTilesetTileProperty";
import Transport from "./Transport";
import definables from "../maps/definables";
import tileWidth from "../constants/tileWidth";
import tilesets from "../maps/tilesets";

class Tileset extends Definable {
    private readonly image: ImageSource;
    private readonly tiledTileset: TiledTileset | null = null;

    public constructor(slug: string) {
        super(slug);
        this.image = new ImageSource(`tilesheets/${this.slug}`);
        const tileset: TiledTileset | undefined = tilesets.get(slug);
        if (typeof tileset !== "undefined") {
            this.tiledTileset = tileset;
        }
    }

    public getImage(): ImageSource {
        return this.image;
    }

    public getTileX(tileID: number): number | null {
        const width: number | null = this.getWidth();
        if (width !== null) {
            return tileID % width;
        }
        return null;
    }

    public getTileY(tileID: number): number | null {
        const width: number | null = this.getWidth();
        if (width !== null) {
            return Math.floor(tileID / width);
        }
        return null;
    }

    public getTransportAtTile(tileID: number): Transport | null {
        if (this.tiledTileset !== null) {
            const properties: TiledTilesetTileProperty[] | undefined = this.tiledTileset.tiles[tileID].properties;
            if (typeof properties !== "undefined") {
                const matched: TiledTilesetTileProperty | undefined = properties.find((property: TiledTilesetTileProperty): boolean => property.name === "transport");
                if (typeof matched !== "undefined" && typeof matched.value === "string" && matched.value.length > 0) {
                    const transports: Map<string, Definable> | undefined = definables.get("Transport");
                    if (typeof transports !== "undefined") {
                        const transport: Definable | undefined = transports.get(matched.value);
                        if (transport instanceof Transport) {
                            return transport;
                        }
                    }
                }
            }
        }
        return null;
    }

    public hasCollisionAtTile(tileID: number): boolean {
        if (this.tiledTileset !== null) {
            const properties: TiledTilesetTileProperty[] | undefined = this.tiledTileset.tiles[tileID].properties;
            if (typeof properties !== "undefined") {
                const matched: TiledTilesetTileProperty | undefined = properties.find((property: TiledTilesetTileProperty): boolean => property.name === "collision");
                if (typeof matched !== "undefined" && matched.value === true) {
                    return true;
                }
            }
        }
        return false;
    }

    private getWidth(): number | null {
        if (this.tiledTileset !== null) {
            return this.tiledTileset.imagewidth / tileWidth;
        }
        return null;
    }
}

export default Tileset;