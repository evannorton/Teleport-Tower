import Definable from "./Definable";
import ImageSource from "./ImageSource";
import Renderable from "../interfaces/Renderable";
import Updatable from "../interfaces/Updatable";
import drawImage from "../functions/draw/drawImage";
import links from "../elements/links";
import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";
import state from "../state";

class Cutscene extends Definable implements Renderable, Updatable {
    private readonly frames: number;
    private readonly image: ImageSource;
    private startedAt: number | null = null;
    private readonly width: number;
    public constructor(slug: string, frames: number, width: number) {
        super(slug);
        this.image = new ImageSource(`cutscenes/${this.slug}`);
        this.frames = frames;
        this.width = width;
    }

    public render(): void {
        if (this.startedAt !== null) {
            const diff: number = state.now - this.startedAt;
            const frameDuration: number = 100;
            const totalLength: number = frameDuration * this.frames;
            const frame: number = Math.floor(diff / totalLength * this.frames);
            const sourceX: number = frame % this.width * screenWidth;
            const sourceY: number = Math.floor(frame / this.width) * screenHeight;
            drawImage(this.image, sourceX, sourceY, screenWidth, screenHeight, 0, 0, screenWidth, screenHeight, 8);
        }
    }

    public update(): void {
        if (state.cutscene === this.slug && this.startedAt === null) {
            this.startedAt = state.now;
        }
        else if (this.startedAt !== null) {
            const diff: number = state.now - this.startedAt;
            const frameDuration: number = 100;
            const totalLength: number = frameDuration * this.frames;
            if (diff > totalLength) {
                this.startedAt = null;
                state.cutscene = null;
                if (links !== null) {
                    links.classList.add("hidden");
                }
            }
        }
    }
}

export default Cutscene;