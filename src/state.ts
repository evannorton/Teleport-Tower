import { Application } from "@pixi/app";
import AudioSource from "./classes/AudioSource";
import Player from "./classes/Player";

const state: {
    app: Application | null;
    cutscene: string | null;
    fontLoaded: boolean;
    heldKeys: string[];
    interactedAt: number | null;
    mouseHeldAt: number | null;
    mouseX: number | null;
    mouseY: number | null;
    now: number;
    pausedAudio: AudioSource[];
    player: Player | null;
    resetAt: number;
    runEndedAt: number | null;
    tickedAt: number;
} = {
    app: null,
    cutscene: "intro",
    fontLoaded: false,
    heldKeys: [],
    interactedAt: null,
    mouseHeldAt: null,
    mouseX: null,
    mouseY: null,
    now: performance.now(),
    pausedAudio: [],
    player: null,
    resetAt: performance.now(),
    runEndedAt: null,
    tickedAt: 0
};

export default state;