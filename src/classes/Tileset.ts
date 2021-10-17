import Definable from "./Definable";
import ImageSource from "./ImageSource";
import TiledTileset from "../interfaces/tiled/TiledTileset";
import TiledTilesetTileProperty from "../interfaces/tiled/TiledTilesetTileProperty";
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

    public hasCollisionAtIndex(index: number): boolean {
        if (this.tiledTileset) {
            const properties: TiledTilesetTileProperty[] | undefined = this.tiledTileset.tiles[index].properties;
            if (typeof properties !== "undefined") {
                const property: TiledTilesetTileProperty | undefined = properties.find((tileProperty: TiledTilesetTileProperty): boolean => tileProperty.name === "collision");
                if (typeof property !== "undefined") {
                    if (typeof property.value === "boolean") {
                        return property.value;
                    }
                }
            }
        }
        return false;
    }

    private getXAtIndex(index: number): number | null {
        if (this.tiledTileset !== null) {
            return index % (this.tiledTileset.imagewidth / 16);
        }
        return null;
    }

    private getYAtIndex(index: number): number | null {
        if (this.tiledTileset !== null) {
            return Math.floor(index / (this.tiledTileset.imagewidth / 16));
        }
        return null;
    }
}

export default Tileset;