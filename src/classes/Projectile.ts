import AudioSource from "./AudioSource";
import Definable from "./Definable";
import ImageSource from "./ImageSource";
import Player from "./Player";
import Renderable from "../interfaces/Renderable";
import Tilemap from "./Tilemap";
import Updatable from "../interfaces/Updatable";
import definables from "../maps/definables";
import drawImage from "../functions/draw/drawImage";
import getCameraX from "../functions/getCameraX";
import getCameraY from "../functions/getCameraY";
import { nanoid } from "nanoid";
import projectileDuration from "../constants/projectileDuration";
import screenWidth from "../constants/screenWidth";
import state from "../state";

class Projectile extends Definable implements Renderable, Updatable {
    private readonly collisionLeftOffset: number = 2;
    private readonly collisionRightOffset: number = 2;
    private readonly height: number = 7;
    private readonly player: Player;
    private readonly spawnedAt: number = state.now;
    private teleportedAt: number | null = null;
    private readonly width: number = 7;
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

    public getTeleportedAt(): number | null {
        return this.teleportedAt;
    }

    public getWidth(): number {
        return this.width;
    }

    public getX(): number {
        return this.x;
    }

    public getXDirection(): "left" | "right" {
        return this.xDirection;
    }

    public getXVelocity(): number {
        return this.xVelocity;
    }

    public getYVelocity(): number {
        return this.yVelocity;
    }

    public getY(): number {
        return this.y;
    }

    public playBounce(): void {
        const audio: Map<string, Definable> | undefined = definables.get("AudioSource");
        if (typeof audio !== "undefined") {
            const bounce: Definable | undefined = audio.get("sfx/bounce");
            if (bounce instanceof AudioSource) {
                bounce.setSFXVolume();
                bounce.play(null, null, true);
            }
        }
    }

    public remove(): void {
        this.list.delete(this.slug);
    }

    public render(): void {
        const images: Map<string, Definable> | undefined = definables.get("ImageSource");
        if (typeof images !== "undefined") {
            if (this.teleportedAt === null) {
                const projectileImage: Definable | undefined = images.get("projectile");
                if (projectileImage instanceof ImageSource) {
                    drawImage(projectileImage, 0, 0, this.width, this.height, this.x - getCameraX(), this.y - getCameraY(), this.width, this.height, 6);
                }
            }
            else {
                const portalImage: Definable | undefined = images.get("portal");
                if (portalImage instanceof ImageSource) {
                    const elapsed: number = state.now - this.teleportedAt;
                    const frame: number = elapsed > 200
                        ? 2
                        : elapsed > 100
                            ? 1
                            : 0;
                    drawImage(portalImage, frame * 24, 0, 24, 24, this.x + this.width / 2 - 12 - getCameraX(), this.y + this.height / 2 - 12 - getCameraY(), 24, 24, 4);
                }
            }
        }
    }

    public update(): void {
        if (this.teleportedAt === null) {
            if (state.now - this.spawnedAt > projectileDuration && this.player.canTeleport()) {
                this.teleportedAt = state.now;
            }
            else {
                switch (this.xDirection) {
                    case "left":
                        if (this.hasCollisionOnLeft()) {
                            this.xDirection = "right";
                            this.playBounce();
                        }
                        else {
                            this.x -= this.getLeftMovableWidth();
                        }
                        break;
                    case "right":
                        if (this.hasCollisionOnRight()) {
                            this.xDirection = "left";
                            this.playBounce();
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
                            this.playBounce();
                        }
                        else {
                            this.y -= this.getTopMovableHeight();
                        }
                        break;
                    case "down":
                        if (this.hasCollisionOnBottom()) {
                            this.yDirection = "up";
                            this.playBounce();
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
        else if (state.now - this.teleportedAt >= 400) {
            this.list.delete(this.slug);
            this.player.teleport();
        }
        else if (state.now - this.teleportedAt >= 300) {
            this.player.preTeleport();
        }
    }

    private getBottomMovableHeight(): number {
        const sinceUpdate: number = state.now - state.tickedAt;
        let pixels: number = 0;
        for (let y: number = 0; true; y++) {
            if (y >= sinceUpdate * this.yVelocity / 1000) {
                return sinceUpdate * this.yVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x + this.collisionLeftOffset + 1), Math.round(this.y + this.height + y), this.width - 2 - this.collisionLeftOffset - this.collisionRightOffset, 0)) {
                return pixels;
            }
            pixels++;
        }
    }

    private getLeftMovableWidth(): number {
        const sinceUpdate: number = state.now - state.tickedAt;
        let pixels: number = 0;
        for (let x: number = 0; true; x++) {
            if (x >= sinceUpdate * this.xVelocity / 1000) {
                return sinceUpdate * this.xVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x + this.collisionLeftOffset - x), Math.round(this.y + 1), 0, this.height - 2)) {
                return pixels;
            }
            pixels++;
        }
    }

    private getRightMovableWidth(): number {
        const sinceUpdate: number = state.now - state.tickedAt;
        let pixels: number = 0;
        for (let x: number = 0; true; x++) {
            if (x >= sinceUpdate * this.xVelocity / 1000) {
                return sinceUpdate * this.xVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x + this.width - this.collisionRightOffset + x), Math.round(this.y + 1), 0, this.height - 2)) {
                return pixels;
            }
            pixels++;
        }
    }

    private getTopMovableHeight(): number {
        const sinceUpdate: number = state.now - state.tickedAt;
        let pixels: number = 0;
        for (let y: number = 0; true; y++) {
            if (y >= sinceUpdate * this.yVelocity / 1000) {
                return sinceUpdate * this.yVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x + this.collisionLeftOffset + 1), Math.round(this.y - y), this.width - 2 - this.collisionLeftOffset - this.collisionRightOffset, 0)) {
                return pixels;
            }
            pixels++;
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
        return this.hasCollisionInRectangle(Math.round(this.x + this.collisionLeftOffset) + 1, Math.round(this.y + this.height), this.width - 2 - this.collisionLeftOffset - this.collisionRightOffset, 0);
    }

    private hasCollisionOnLeft(): boolean {
        return this.hasCollisionInRectangle(Math.round(this.x + this.collisionLeftOffset), Math.round(this.y + 1), 0, this.height - 2);
    }

    private hasCollisionOnRight(): boolean {
        return this.hasCollisionInRectangle(Math.round(this.x + this.width - this.collisionRightOffset), Math.round(this.y + 1), 0, this.height - 2);
    }

    private hasCollisionOnTop(): boolean {
        return this.hasCollisionInRectangle(Math.round(this.x + this.collisionLeftOffset) + 1, Math.round(this.y), this.width - 2 - this.collisionLeftOffset - this.collisionRightOffset, 0);
    }
}

export default Projectile;