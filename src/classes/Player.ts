import Definable from "./Definable";
import ImageSource from "./ImageSource";
import Renderable from "../interfaces/Renderable";
import Updatable from "../interfaces/Updatable";
import definables from "../maps/definables";
import drawImage from "../functions/draw/drawImage";
import { nanoid } from "nanoid";
import screenHeight from "../constants/screenHeight";
import state from "../state";

class Player extends Definable implements Renderable, Updatable {
    private readonly height: number = 32;
    private readonly map: string = "main";
    private readonly width: number = 32;
    private x: number = 128;
    private readonly y: number = 960;
    public constructor() {
        super(nanoid());
    }

    public render(): void {
        const imageSources: Map<string, Definable> | undefined = definables.get("ImageSource");
        if (typeof imageSources !== "undefined") {
            const image: Definable | undefined = imageSources.get("player");
            if (image instanceof ImageSource) {
                drawImage(image, 0, 0, this.width, this.height, this.x, screenHeight / 2 + this.height * 1.5, this.width, this.height, 2);
            }
        }
    }

    public update(): void {
        const movementKey: string | undefined = [...state.heldKeys].reverse().find((key: string): boolean => ["a", "s", "arrowleft", "arrowright"].includes(key));
        switch (movementKey) {
            case "a":
            case "arrowleft":
                this.x--;
                break;
            case "s":
            case "arrowright":
                this.x++;
                break;
        }
    }
}

export default Player;