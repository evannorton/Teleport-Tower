import { Application } from "@pixi/app";
import Player from "./classes/Player";

const state: {
    app: Application | null;
    heldKeys: string[];
    now: number;
    player: Player | null;
    updatedAt: number;
} = {
    app: null,
    heldKeys: [],
    now: performance.now(),
    player: null,
    updatedAt: 0
};

export default state;