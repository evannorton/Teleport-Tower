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
import { nanoid } from "nanoid";
import state from "../state";

class Player extends Definable implements Renderable, Updatable {
    private fallVelocity: number = baseFallVelocity;
    private readonly height: number = 32;
    private readonly map: string = "main";
    private movementDirection: "left" | "right" | null = null;
    private movementVelocity: number = 0;
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
        if (this.hasCollisionOnBottom()) {
            if (state.heldKeys.length === 0) {
                this.movementDirection = null;
                this.movementVelocity = 0;
            }
            else {
                const movementKey: string | undefined = [...state.heldKeys].reverse().find((key: string): boolean => ["a", "d", "arrowleft", "arrowright"].includes(key));
                switch (movementKey) {
                    case "a":
                    case "arrowleft":
                        this.movementDirection = "left";
                        this.movementVelocity = 32;
                        break;
                    case "d":
                    case "arrowright":
                        this.movementDirection = "right";
                        this.movementVelocity = 32;
                        break;
                }
            }
        }
        switch (this.movementDirection) {
            case "left":
                if (this.hasCollisionOnLeft() === false) {
                    this.x -= this.getLeftMovableWidth();
                }
                break;
            case "right":
                if (this.hasCollisionOnRight() === false) {
                    this.x += this.getRightMovableWidth();
                }
                break;
        }
        if (this.hasCollisionOnBottom()) {
            this.fallVelocity = baseFallVelocity;
        }
        else {
            this.y += this.getFallableHeight();
            if (this.fallVelocity < maxFallVelocity) {
                this.fallVelocity = Math.min(this.fallVelocity + sinceUpdate * fallAcceleration / 1000, maxFallVelocity);
            }
            else {
                this.fallVelocity = maxFallVelocity;
            }
        }
    }

    private getFallableHeight(): number {
        const sinceUpdate: number = state.now - state.updatedAt;
        const pixels: number[] = [];
        for (let y: number = 0; true; y++) {
            if (y >= sinceUpdate * this.fallVelocity / 1000) {
                return sinceUpdate * this.fallVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x + 1), Math.round(this.y + this.height + y), this.width - 2, 0)) {
                return getSumOfNumbers(pixels);
            }
            pixels.push(1);
        }
    }

    private getLeftMovableWidth(): number {
        const sinceUpdate: number = state.now - state.updatedAt;
        const pixels: number[] = [];
        for (let x: number = 0; true; x++) {
            if (x >= sinceUpdate * this.movementVelocity / 1000) {
                return sinceUpdate * this.movementVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x - x), Math.round(this.y), 0, this.height - 1)) {
                return getSumOfNumbers(pixels);
            }
            pixels.push(1);
        }
    }

    private getRightMovableWidth(): number {
        const sinceUpdate: number = state.now - state.updatedAt;
        const pixels: number[] = [];
        for (let x: number = 0; true; x++) {
            if (x >= sinceUpdate * this.movementVelocity / 1000) {
                return sinceUpdate * this.movementVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x + this.width + x), Math.round(this.y), 0, this.height - 1)) {
                return getSumOfNumbers(pixels);
            }
            pixels.push(1);
        }
    }

    private hasCollisionInRectangle(x: number, y: number, width: number, height: number): boolean {
        const tilemaps: Map<string, Definable> | undefined = definables.get("Tilemap");
        if (typeof tilemaps !== "undefined") {
            const tilemap: Definable | undefined = tilemaps.get(this.map);
            if (tilemap instanceof Tilemap) {
                return tilemap.hasCollisionInRectangle(x, y, width, height);
            }
        }
        return false;
    }

    private hasCollisionOnBottom(): boolean {
        return this.hasCollisionInRectangle(Math.round(this.x) + 1, Math.round(this.y + this.height), this.width - 2, 0);
    }

    private hasCollisionOnLeft(): boolean {
        return this.hasCollisionInRectangle(Math.round(this.x), Math.round(this.y), 0, this.height - 1);
    }

    private hasCollisionOnRight(): boolean {
        return this.hasCollisionInRectangle(Math.round(this.x + this.width), Math.round(this.y), 0, this.height - 1);
    }
}

export default Player;