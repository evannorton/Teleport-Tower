import { Application } from "@pixi/app";
import AudioSource from "./classes/AudioSource";
import Player from "./classes/Player";

const state: {
    app: Application | null;
    cutscene: string | null;
    heldKeys: string[];
    interactedAt: number | null;
    mouseHeldAt: number | null;
    mouseX: number | null;
    mouseY: number | null;
    now: number;
    pausedAudio: AudioSource[];
    player: Player | null;
    tickedAt: number;
} = {
    app: null,
    cutscene: "intro",
    heldKeys: [],
    interactedAt: null,
    mouseHeldAt: null,
    mouseX: null,
    mouseY: null,
    now: performance.now(),
    pausedAudio: [],
    player: null,
    tickedAt: 0
};

export default state;