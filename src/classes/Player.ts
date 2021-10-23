import Definable from "./Definable";
import ImageSource from "./ImageSource";
import Projectile from "./Projectile";
import Renderable from "../interfaces/Renderable";
import Tilemap from "./Tilemap";
import Transport from "./Transport";
import Updatable from "../interfaces/Updatable";
import baseFallVelocity from "../constants/baseFallVelocity";
import blinkDuration from "../constants/blinkDuration";
import blinkInterval from "../constants/blinkInterval";
import definables from "../maps/definables";
import drawImage from "../functions/draw/drawImage";
import drawRectangle from "../functions/draw/drawRectangle";
import fallAcceleration from "../constants/fallAcceleration";
import getCameraX from "../functions/getCameraX";
import getCameraY from "../functions/getCameraY";
import getSumOfNumbers from "../functions/getSumOfNumbers";
import maxFallVelocity from "../constants/maxFallVelocity";
import maxProjectilePower from "../constants/maxProjectilePower";
import minProjectilePower from "../constants/minProjectilePower";
import movementVelocity from "../constants/movementVelocity";
import { nanoid } from "nanoid";
import projectileChargeLength from "../constants/projectileChargeLength";
import screenHeight from "../constants/screenHeight";
import state from "../state";
import step from "../constants/step";
import walkSpeed from "../constants/walkSpeed";

class Player extends Definable implements Renderable, Updatable {
    private blinkedAt: number = state.now;
    private readonly collisionLeftOffset: number = 8;
    private readonly collisionRightOffset: number = 8;
    private direction: "left" | "right" = "left";
    private fallVelocity: number = baseFallVelocity;
    private readonly height: number = 32;
    private map: string = "part1";
    private movementVelocity: number = 0;
    private projectile: Projectile | null = null;
    private readonly width: number = 32;
    private walkedAt: number | null = null;
    private x: number = 180;
    private y: number = 816;
    public constructor() {
        super(nanoid());
    }

    public blink(): void {
        this.blinkedAt = state.now;
    }

    public canTeleport(): boolean {
        if (this.projectile !== null) {
            const x: number = this.projectile.getX() + this.projectile.getWidth() / 2 - this.width / 2;
            const y: number = this.projectile.getY() + this.projectile.getHeight() / 2 - this.height / 2;
            const tilemaps: Map<string, Definable> | undefined = definables.get("Tilemap");
            if (typeof tilemaps !== "undefined") {
                const tilemap: Definable | undefined = tilemaps.get(this.map);
                if (tilemap instanceof Tilemap) {
                    return tilemap.hasCollisionInRectangle(x + this.collisionLeftOffset, y, this.width - this.collisionLeftOffset - this.collisionRightOffset, this.height) === false;
                }
            }
        }
        return false;
    }

    public cancelTeleport(): void {
        this.projectile = null;
    }

    public getHeight(): number {
        return this.height;
    }

    public getMap(): string {
        return this.map;
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
        if (state.cutscene === null) {
            const imageSources: Map<string, Definable> | undefined = definables.get("ImageSource");
            if (typeof imageSources !== "undefined") {
                const image: Definable | undefined = imageSources.get("player");
                if (image instanceof ImageSource) {
                    drawImage(image, this.getSourceX(), this.getSourceY(), this.width, this.height, this.x - getCameraX(), this.y - getCameraY(), this.width, this.height, 4);
                }
            }
            if (state.mouseHeldAt !== null) {
                const timeHeld: number = state.now - state.mouseHeldAt;
                const percent: number = Math.min(timeHeld / projectileChargeLength, 1);
                const offset: number = 4;
                const width: number = 80;
                const height: number = 24;
                if (this.hasCollisionOnBottom() && this.projectile === null) {
                    drawRectangle("#343434", offset, screenHeight - offset - height, width, height, 6);
                    drawRectangle("#e03c28", offset, screenHeight - offset - height, percent * width, height, 6);
                }
            }
        }
    }

    public shoot(): void {
        if (this.hasCollisionOnBottom() && this.projectile === null && state.mouseX !== null && state.mouseY !== null && state.mouseHeldAt !== null && state.cutscene === null) {
            const range: number = maxProjectilePower - minProjectilePower;
            const timeHeld: number = state.now - state.mouseHeldAt;
            const percent: number = Math.min(timeHeld / projectileChargeLength, 1);
            const power: number = minProjectilePower + range * percent;
            const mouseRealX: number = state.mouseX + getCameraX();
            const mouseRealY: number = state.mouseY + getCameraY();
            const playerRealX: number = this.x + this.width / 2;
            const playerRealY: number = this.y + this.height / 2;
            const diffX: number = Math.abs(mouseRealX - playerRealX);
            const diffY: number = Math.abs(mouseRealY - playerRealY);
            const angle: number = Math.atan2(diffY, diffX);
            const xVector: number = Math.cos(angle);
            const yVector: number = Math.sin(angle);
            this.projectile = new Projectile(this, playerRealX, playerRealY, this.isAimingLeft() ? "left" : "right", this.isAimingUp() ? "up" : "down", xVector * power, yVector * power);
        }
    }

    public teleport(): void {
        if (this.projectile !== null) {
            this.x = this.projectile.getX() + this.projectile.getWidth() / 2 - this.width / 2;
            this.y = this.projectile.getY() + this.projectile.getHeight() / 2 - this.height / 2;
            this.movementVelocity = 0;
            this.fallVelocity = baseFallVelocity;
            this.projectile = null;
            this.transport();
        }
    }

    public update(): void {
        if (state.cutscene === null) {
            if (state.now > blinkDuration + blinkInterval + this.blinkedAt) {
                this.blink();
            }
            if (this.hasCollisionOnBottom()) {
                const movementKey: string | undefined = [...state.heldKeys].reverse().find((key: string): boolean => ["a", "d", "arrowleft", "arrowright"].includes(key));
                if (state.mouseHeldAt !== null || typeof movementKey === "undefined") {
                    this.movementVelocity = 0;
                    this.walkedAt = null;
                }
                else {
                    this.blink();
                    if (this.walkedAt === null) {
                        this.walkedAt = state.now;
                    }
                    this.movementVelocity = movementVelocity;
                    switch (movementKey) {
                        case "a":
                        case "arrowleft":
                            this.direction = "left";
                            break;
                        case "d":
                        case "arrowright":
                            this.direction = "right";
                            break;
                    }
                }
            }
            switch (this.direction) {
                case "left":
                    if (this.hasCollisionOnLeft() === false) {
                        const moved: number = this.getLeftMovableWidth() * (this.hasCollisionOnBottom() ? 1 : 0.5);
                        if (moved > 0) {
                            if (state.mouseHeldAt !== null) {
                                state.mouseHeldAt = state.now;
                            }
                            this.blink();
                            this.x -= moved;
                            this.transport();
                        }
                    }
                    break;
                case "right":
                    if (this.hasCollisionOnRight() === false) {
                        const moved: number = this.getRightMovableWidth() * (this.hasCollisionOnBottom() ? 1 : 0.5);
                        if (moved > 0) {
                            if (state.mouseHeldAt !== null) {
                                state.mouseHeldAt = state.now;
                            }
                            this.blink();
                            this.x += moved;
                            this.transport();
                        }
                    }
                    break;
            }
            if (this.hasCollisionOnBottom()) {
                this.fallVelocity = baseFallVelocity;
            }
            else {
                const moved: number = this.getFallableHeight();
                if (moved > 0) {
                    if (state.mouseHeldAt !== null) {
                        state.mouseHeldAt = state.now;
                    }
                    this.blink();
                    this.y += moved;
                    this.transport();
                }
                if (this.fallVelocity < maxFallVelocity) {
                    this.fallVelocity = Math.min(this.fallVelocity + step * fallAcceleration / 1000, maxFallVelocity);
                }
                else {
                    this.fallVelocity = maxFallVelocity;
                }
            }
        }
        else {
            this.blink();
        }
    }

    private getFallableHeight(): number {
        const pixels: number[] = [];
        for (let y: number = 0; true; y++) {
            if (y >= step * this.fallVelocity / 1000) {
                return step * this.fallVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x + this.collisionLeftOffset + 1), Math.round(this.y + this.height + y), this.width - 2 - this.collisionLeftOffset - this.collisionRightOffset, 0)) {
                return getSumOfNumbers(pixels);
            }
            pixels.push(1);
        }
    }

    private getLeftMovableWidth(): number {
        const pixels: number[] = [];
        for (let x: number = 0; true; x++) {
            if (x >= step * this.movementVelocity / 1000) {
                return step * this.movementVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x + this.collisionLeftOffset - x), Math.round(this.y + 1), 0, this.height - 2)) {
                return getSumOfNumbers(pixels);
            }
            pixels.push(1);
        }
    }

    private getRightMovableWidth(): number {
        const pixels: number[] = [];
        for (let x: number = 0; true; x++) {
            if (x >= step * this.movementVelocity / 1000) {
                return step * this.movementVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x + this.width - this.collisionRightOffset + x), Math.round(this.y + 1), 0, this.height - 2)) {
                return getSumOfNumbers(pixels);
            }
            pixels.push(1);
        }
    }

    private getSourceX(): number {
        // Falling
        if (this.hasCollisionOnBottom() === false) {
            return 0;
        }
        // Walking
        if (this.walkedAt !== null) {
            const totalDuration: number = walkSpeed * 5;
            const sinceWalked: number = state.now - this.walkedAt;
            return Math.floor(sinceWalked % totalDuration / walkSpeed) * this.width;
        }
        // Aiming
        if (this.projectile === null && state.mouseHeldAt !== null && state.mouseY !== null) {
            if (state.mouseY < this.y - getCameraY()) {
                return this.width;
            }
            if (state.mouseY > this.y - getCameraY() + this.height) {
                return this.width * 2;
            }
            return 0;
        }
        // Idle
        if (state.now > this.blinkedAt + blinkInterval) {
            return this.width;
        }
        return 0;
    }

    private getSourceY(): number {
        // Falling
        if (this.hasCollisionOnBottom() === false) {
            switch (this.direction) {
                case "left":
                    return this.height * 7;
                case "right":
                    return this.height * 3;
            }
        }
        // Walking
        if (this.walkedAt !== null) {
            switch (this.direction) {
                case "left":
                    return this.height * 5;
                case "right":
                    return this.height;
            }
        }
        // Aiming
        if (this.projectile === null && state.mouseHeldAt !== null && state.mouseX !== null) {
            if (this.isAimingLeft()) {
                return this.height * 6;
            }
            return this.height * 2;
        }
        // Idle
        switch (this.direction) {
            case "left":
                return this.height * 4;
            case "right":
                return 0;
        }
        return 0;
    }

    private getTransport(): Transport | null {
        const tilemaps: Map<string, Definable> | undefined = definables.get("Tilemap");
        if (typeof tilemaps !== "undefined") {
            const tilemap: Definable | undefined = tilemaps.get(this.map);
            if (tilemap instanceof Tilemap) {
                return tilemap.getTransportInRectangle(this.x + this.collisionLeftOffset, this.y, this.width - this.collisionLeftOffset - this.collisionRightOffset, this.height);
            }
        }
        return null;
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
        return this.hasCollisionInRectangle(Math.round(this.x + this.collisionLeftOffset) + 1, Math.round(this.y + this.height), this.width - 2 - this.collisionLeftOffset - this.collisionRightOffset, 0);
    }

    private hasCollisionOnLeft(): boolean {
        return this.hasCollisionInRectangle(Math.round(this.x + this.collisionLeftOffset), Math.round(this.y + 1), 0, this.height - 2);
    }

    private hasCollisionOnRight(): boolean {
        return this.hasCollisionInRectangle(Math.round(this.x + this.width - this.collisionRightOffset), Math.round(this.y + 1), 0, this.height - 2);
    }

    private isAimingLeft(): boolean {
        if (state.mouseX !== null) {
            return state.mouseX < this.x + this.width / 2 - getCameraX();
        }
        return false;
    }

    private isAimingUp(): boolean {
        if (state.mouseY !== null) {
            return state.mouseY < this.y + this.height / 2 - getCameraY();
        }
        return false;
    }

    private transport(): void {
        const transport: Transport | null = this.getTransport();
        if (transport !== null) {
            this.x = transport.getX();
            this.y = transport.getY();
            this.map = transport.getMap().getSlug();
        }
    }
}

export default Player;