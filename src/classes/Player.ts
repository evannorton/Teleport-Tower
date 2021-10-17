import Definable from "./Definable";
import { nanoid } from "nanoid";

class Player extends Definable {
    private readonly height: number = 32;
    private readonly map: string = "main";
    private readonly width: number = 32;
    private readonly x: number = 4;
    private readonly y: number = 30;
    public constructor() {
        super(nanoid());
    }
}

export default Player;