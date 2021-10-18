import { Application } from "@pixi/app";
import Player from "./classes/Player";

const state: {
    app: Application | null;
    heldKeys: string[];
    now: number;
    player: Player | null;
    tickedAt: number | null;
} = {
    app: null,
    heldKeys: [],
    now: 0,
    player: null,
    tickedAt: null
};

export default state;