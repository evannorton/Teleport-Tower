import { Application } from "@pixi/app";
import Player from "./classes/Player";

const state: {
    app: Application | null;
    cutscene: string | null;
    deltaTime: number;
    heldKeys: string[];
    mouseHeldAt: number | null;
    mouseX: number | null;
    mouseY: number | null;
    now: number;
    player: Player | null;
    updatedAt: number;
} = {
    app: null,
    cutscene: "intro",
    deltaTime: 0,
    heldKeys: [],
    mouseHeldAt: null,
    mouseX: null,
    mouseY: null,
    now: performance.now(),
    player: null,
    updatedAt: 0
};

export default state;