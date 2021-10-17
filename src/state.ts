import { Application } from "@pixi/app";
import Player from "./classes/Player";

const state: {
    app: Application | null;
    player: Player;
} = {
    app: null,
    player: new Player
};

export default state;