import Definable from "./Definable";
import ImageSource from "./ImageSource";
import Music from "./Music";
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
import fallAcceleration from "../constants/fallAcceleration";
import getCameraX from "../functions/getCameraX";
import getCameraY from "../functions/getCameraY";
import maxFallVelocity from "../constants/maxFallVelocity";
import maxProjectilePower from "../constants/maxProjectilePower";
import minProjectilePower from "../constants/minProjectilePower";
import movementVelocity from "../constants/movementVelocity";
import { nanoid } from "nanoid";
import projectileChargeLength from "../constants/projectileChargeLength";
import screenWidth from "../constants/screenWidth";
import state from "../state";
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

    public playMusic(): void {
        const music: Map<string, Definable> | undefined = definables.get("Music");
        if (typeof music !== "undefined") {
            music.forEach((track: Definable | undefined): void => {
                if (track instanceof Music) {
                    if (track.getMap() === this.map) {
                        track.play();
                    }
                    else {
                        track.stop();
                    }
                }
            });
        }
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
            if (state.mouseHeldAt !== null && this.hasCollisionOnBottom() && this.projectile === null) {
                const meter: Definable | undefined = imageSources?.get("meter");
                if (meter instanceof ImageSource) {
                    const diff: number = state.now - state.mouseHeldAt;
                    const frameDuration: number = projectileChargeLength / 50;
                    const totalLength: number = frameDuration * 50;
                    const frame: number = Math.min(49, Math.floor(diff / totalLength * 50));
                    const sourceX: number = frame % 8 * 25;
                    const sourceY: number = Math.floor(frame / 8) * 25;
                    const x: number = (this.isAimingLeft() ? this.x + this.width + 0 : this.x - 25 - 0) - getCameraX();
                    const y: number = this.y - 25 + 12 - getCameraY();
                    drawImage(meter, sourceX, sourceY, 25, 25, Math.min(Math.max(x, 1), screenWidth - 26), y, 25, 25, 8);
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
            this.movementVelocity = this.projectile.getXVelocity();
            this.direction = this.projectile.getXDirection();
            this.fallVelocity = baseFallVelocity;
            this.projectile = null;
            this.transport();
        }
    }

    public update(): void {
        const sinceUpdate: number = state.now - state.tickedAt;
        if (state.cutscene === null) {
            if (state.now > blinkDuration + blinkInterval + this.blinkedAt) {
                this.blink();
            }
            if (this.hasCollisionOnBottom()) {
                let movementKey: string | null = null;
                for (let iA: number = state.heldKeys.length - 1; iA >= 0; iA--) {
                    const key: string = state.heldKeys[iA];
                    if (["a", "d", "arrowleft", "arrowright"].includes(key)) {
                        movementKey = key;
                        break;
                    }
                }
                if (state.mouseHeldAt !== null || movementKey === null) {
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
                    if (this.hasCollisionOnLeft()) {
                        if (this.hasCollisionOnBottom() === false) {
                            this.direction = "right";
                            this.movementVelocity /= 2;
                        }
                    }
                    else {
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
                    if (this.hasCollisionOnRight()) {
                        if (this.hasCollisionOnBottom() === false) {
                            this.direction = "left";
                            this.movementVelocity /= 2;
                        }
                    }
                    else {
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
                    this.fallVelocity = Math.min(this.fallVelocity + sinceUpdate * fallAcceleration / 1000, maxFallVelocity);
                }
                else {
                    this.fallVelocity = maxFallVelocity;
                }
            }
        }
        else {
            this.blink();
            if (state.mouseHeldAt !== null) {
                state.mouseHeldAt = state.now;
            }
        }
    }

    private getFallableHeight(): number {
        const sinceUpdate: number = state.now - state.tickedAt;
        let pixels: number = 0;
        for (let y: number = 0; true; y++) {
            if (y >= sinceUpdate * this.fallVelocity / 1000) {
                return sinceUpdate * this.fallVelocity / 1000;
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
            if (x >= sinceUpdate * this.movementVelocity / 1000) {
                return sinceUpdate * this.movementVelocity / 1000;
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
            if (x >= sinceUpdate * this.movementVelocity / 1000) {
                return sinceUpdate * this.movementVelocity / 1000;
            }
            if (this.hasCollisionInRectangle(Math.round(this.x + this.width - this.collisionRightOffset + x), Math.round(this.y + 1), 0, this.height - 2)) {
                return pixels;
            }
            pixels++;
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
            if (this.projectile !== null) {
                this.projectile.remove();
                this.projectile = null;
            }
            this.playMusic();
        }
    }
}

export default Player;