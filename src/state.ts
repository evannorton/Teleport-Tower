import { Application } from "@pixi/app";
import Player from "./classes/Player";

const state: {
    app: Application | null;
    player: Player | null;
} = {
    app: null,
    player: null
};

export default state;