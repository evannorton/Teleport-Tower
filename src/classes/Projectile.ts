import Definable from "./Definable";
import Player from "./Player";
import Renderable from "../interfaces/Renderable";
import Tilemap from "./Tilemap";
import Updatable from "../interfaces/Updatable";
import definables from "../maps/definables";
import drawRectangle from "../functions/draw/drawRectangle";
import getCameraX from "../functions/getCameraX";
import getCameraY from "../functions/getCameraY";
import getSumOfNumbers from "../functions/getSumOfNumbers";
import { nanoid } from "nanoid";
import projectileDuration from "../constants/projectileDuration";
import screenWidth from "../constants/screenWidth";
import state from "../state";
import step from "../constants/step";

class Projectile extends Definable implements Renderable, Updatable {
    private readonly height: number = 4;
    private readonly player: Player;
    private readonly spawnedAt: number = state.now;
    private readonly width: number = 4;
    private x: number;
    private y: number;
    private xDirection: "left" | "right";
    private readonly xVelocity: number;
    private yDirection: "down" | "up";
    private readonly yVelocity: number;

    public constructor(player: Player, x: number, y: number, xDirection: "left" | "right", yDirection: "down" | "up", xVelocity: number, yVelocity: number) {
        super(nanoid());
        this.player = player;
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
        this.xDirection = xDirection;
        this.yDirection = yDirection;
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
    }

    public getHeight(): number {
        return this.height;
    }

    public getWidth(): number {
        return this.width;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public render(): void {
        drawRectangle("#ffffff", this.x - getCameraX(), this.y - getCameraY(), this.width, this.height, 5);
    }

    public update(): void {
        if (state.now - this.spawnedAt > projectileDuration && this.player.canTeleport()) {
            this.list.delete(this.slug);
            this.player.teleport();
        }
        else {
            switch (this.xDirection) {
                case "left":
                    if (this.hasCollisionOnLeft()) {
                        this.xDirection = "right";
                    }
                    else {
                        this.x -= this.getLeftMovableWidth();
                    }
                    break;
                case "right":
                    if (this.hasCollisionOnRight()) {
                        this.xDirection = "left";
                    }
                    else {
                        this.x += this.getRightMovableWidth();
                    }
                    break;
            }
            switch (this.yDirection) {
                case "up":
                    if (this.hasCollisionOnTop()) {
                        this.yDirection = "down";
                    }
                    else {
                        this.y -= this.getTopMovableHeight();
                    }
                    break;
                case "down":
                    if (this.hasCollisionOnBottom()) {
                        this.yDirection = "up";
                    }
                    else {
                        this.y += this.getBottomMovableHeight();
                    }
                    break;
            }
            if (this.x < 0 || this.x > screenWidth - this.width) {
                this.list.delete(this.slug);
                this.player.cancelTeleport();
            }
        }
    }

    private getBottomMovableHeight(): number {
        const pixels: number[] = [];
        for (let y: number = 0; true; y++) {
            if (y >= step * this.yVelocity / 1000) {
                return step * this.yVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x + 1), Math.round(this.y + this.height + y), this.width - 2, 0)) {
                return getSumOfNumbers(pixels);
            }
            pixels.push(1);
        }
    }

    private getLeftMovableWidth(): number {
        const pixels: number[] = [];
        for (let x: number = 0; true; x++) {
            if (x >= step * this.xVelocity / 1000) {
                return step * this.xVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x - x), Math.round(this.y + 1), 0, this.height - 2)) {
                return getSumOfNumbers(pixels);
            }
            pixels.push(1);
        }
    }

    private getRightMovableWidth(): number {
        const pixels: number[] = [];
        for (let x: number = 0; true; x++) {
            if (x >= step * this.xVelocity / 1000) {
                return step * this.xVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x + this.width + x), Math.round(this.y + 1), 0, this.height - 2)) {
                return getSumOfNumbers(pixels);
            }
            pixels.push(1);
        }
    }

    private getTopMovableHeight(): number {
        const pixels: number[] = [];
        for (let y: number = 0; true; y++) {
            if (y >= step * this.yVelocity / 1000) {
                return step * this.yVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x + 1), Math.round(this.y - y), this.width - 2, 0)) {
                return getSumOfNumbers(pixels);
            }
            pixels.push(1);
        }
    }

    private hasCollisionInRectangle(x: number, y: number, width: number, height: number): boolean {
        const tilemaps: Map<string, Definable> | undefined = definables.get("Tilemap");
        if (typeof tilemaps !== "undefined") {
            const tilemap: Definable | undefined = tilemaps.get(this.player.getMap());
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
        return this.hasCollisionInRectangle(Math.round(this.x), Math.round(this.y + 1), 0, this.height - 2);
    }

    private hasCollisionOnRight(): boolean {
        return this.hasCollisionInRectangle(Math.round(this.x + this.width), Math.round(this.y + 1), 0, this.height - 2);
    }

    private hasCollisionOnTop(): boolean {
        return this.hasCollisionInRectangle(Math.round(this.x) + 1, Math.round(this.y), this.width - 2, 0);
    }
}

export default Projectile;