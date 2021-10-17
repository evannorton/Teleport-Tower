import { Application } from "@pixi/app";
import Player from "./classes/Player";

const state: {
    app: Application | null;
    heldKeys: string[];
    player: Player | null;
} = {
    app: null,
    heldKeys: [],
    player: null
};

export default state;