import Definable from "./Definable";
import Tilemap from "./Tilemap";

class Transport extends Definable {
    private readonly map: Tilemap;
    private readonly x: number;
    private readonly y: number;
    public constructor(slug: string, map: Tilemap, x: number, y: number) {
        super(slug);
        this.map = map;
        this.x = x;
        this.y = y;
    }

    public getMap(): Tilemap {
        return this.map;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }
}

export default Transport;