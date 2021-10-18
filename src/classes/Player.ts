import Coordinate from "../interfaces/Coordinate";
import Definable from "./Definable";
import ImageSource from "./ImageSource";
import Renderable from "../interfaces/Renderable";
import Tilemap from "./Tilemap";
import Updatable from "../interfaces/Updatable";
import baseFallVelocity from "../constants/baseFallVelocity";
import definables from "../maps/definables";
import drawImage from "../functions/draw/drawImage";
import fallAcceleration from "../constants/fallAcceleration";
import getCameraX from "../functions/getCameraX";
import getCameraY from "../functions/getCameraY";
import getSumOfNumbers from "../functions/getSumOfNumbers";
import maxFallVelocity from "../constants/maxFallVelocity";
import movementSpeed from "../constants/movementSpeed";
import { nanoid } from "nanoid";
import state from "../state";

class Player extends Definable implements Renderable, Updatable {
    private fallVelocity: number = baseFallVelocity;
    private readonly height: number = 32;
    private readonly map: string = "main";
    private readonly width: number = 32;
    private x: number = 0;
    private y: number = -32;
    public constructor() {
        super(nanoid());
    }

    public getHeight(): number {
        return this.height;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public isOnMap(map: string): boolean {
        return this.map === map;
    }

    public render(): void {
        const imageSources: Map<string, Definable> | undefined = definables.get("ImageSource");
        if (typeof imageSources !== "undefined") {
            const image: Definable | undefined = imageSources.get("player");
            if (image instanceof ImageSource) {
                drawImage(image, 0, 0, this.width, this.height, this.x - getCameraX(), this.y - getCameraY(), this.width, this.height, 3);
            }
        }
    }

    public update(): void {
        const sinceUpdate: number = state.now - state.updatedAt;
        const movementKey: string | undefined = [...state.heldKeys].reverse().find((key: string): boolean => ["a", "d", "arrowleft", "arrowright"].includes(key));
        switch (movementKey) {
            case "a":
            case "arrowleft":
                if (this.hasCollisionOnLeft() === false) {
                    this.x -= sinceUpdate * movementSpeed / 1000;
                }
                break;
            case "d":
            case "arrowright":
                if (this.hasCollisionOnRight() === false) {
                    this.x += sinceUpdate * movementSpeed / 1000;
                }
                break;
        }
        if (this.hasCollisionOnBottom()) {
            this.fallVelocity = baseFallVelocity;
        }
        else {
            this.y += this.getFallableHeight();
            if (this.fallVelocity < maxFallVelocity) {
                this.fallVelocity = Math.min(this.fallVelocity + fallAcceleration, maxFallVelocity);
            }
            else {
                this.fallVelocity = maxFallVelocity;
            }
        }
    }

    private getFallableHeight(): number {
        const pixels: number[] = [];
        for (let y: number = 0; true; y++) {
            if (y === this.fallVelocity) {
                return this.fallVelocity;
            }
            for (let x: number = 1; x < this.width; x++) {
                if (this.hasCollisionAtCoordinate({
                    x: this.x + x,
                    y: this.y + this.height + y
                })) {
                    return getSumOfNumbers(pixels);
                }
            }
            pixels.push(1);
        }
    }

    private hasCollisionAtCoordinate(coordinate: Coordinate): boolean {
        const tilemaps: Map<string, Definable> | undefined = definables.get("Tilemap");
        if (typeof tilemaps !== "undefined") {
            const tilemap: Definable | undefined = tilemaps.get(this.map);
            if (tilemap instanceof Tilemap) {
                return tilemap.hasCollisionAtCoordinate(coordinate);
            }
        }
        return false;
    }

    private hasCollisionInCoordinates(coordinates: Coordinate[]): boolean {
        return coordinates.some((coordinate: Coordinate): boolean => this.hasCollisionAtCoordinate(coordinate));
    }

    private hasCollisionOnBottom(): boolean {
        const coordinates: Coordinate[] = [];
        for (let i: number = 1; i < this.width; i++) {
            coordinates.push({
                x: this.x + i,
                y: this.y + this.height
            });
        }
        return this.hasCollisionInCoordinates(coordinates);
    }

    private hasCollisionOnLeft(): boolean {
        const coordinates: Coordinate[] = [];
        for (let i: number = 0; i < this.height; i++) {
            coordinates.push({
                x: this.x,
                y: this.y + i
            });
        }
        return this.hasCollisionInCoordinates(coordinates);
    }

    private hasCollisionOnRight(): boolean {
        const coordinates: Coordinate[] = [];
        for (let i: number = 0; i < this.height; i++) {
            coordinates.push({
                x: this.x + this.width,
                y: this.y + i
            });
        }
        return this.hasCollisionInCoordinates(coordinates);
    }
}

export default Player;