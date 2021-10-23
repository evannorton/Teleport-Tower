import { Application } from "@pixi/app";
import Player from "./classes/Player";

const state: {
    app: Application | null;
    cutscene: string | null;
    heldKeys: string[];
    mouseHeldAt: number | null;
    mouseX: number | null;
    mouseY: number | null;
    now: number;
    player: Player | null;
    tickedAt: number;
} = {
    app: null,
    cutscene: "intro",
    heldKeys: [],
    mouseHeldAt: null,
    mouseX: null,
    mouseY: null,
    now: performance.now(),
    player: null,
    tickedAt: 0
};

export default state;