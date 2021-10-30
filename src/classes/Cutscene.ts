import AudioSource from "./AudioSource";
import Definable from "./Definable";
import ImageSource from "./ImageSource";
import Renderable from "../interfaces/Renderable";
import Updatable from "../interfaces/Updatable";
import drawImage from "../functions/draw/drawImage";
import focusScreen from "../functions/focusScreen";
import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";
import state from "../state";

class Cutscene extends Definable implements Renderable, Updatable {
    private readonly audio: AudioSource;
    private readonly frames: number;
    private readonly image: ImageSource;
    private readonly permanent: boolean;
    private startedAt: number | null = null;
    private readonly width: number;
    public constructor(slug: string, frames: number, width: number, permanent: boolean) {
        super(slug);
        this.image = new ImageSource(`cutscenes/${this.slug}`);
        this.audio = new AudioSource(`sfx/cutscenes/${this.slug}`, 1);
        this.frames = frames;
        this.width = width;
        this.permanent = permanent;
    }

    public getAudio(): AudioSource {
        return this.audio;
    }

    public render(): void {
        if (this.startedAt !== null) {
            const diff: number = state.now - this.startedAt;
            const frameDuration: number = 100;
            const totalLength: number = frameDuration * this.frames;
            const frame: number = Math.min(this.frames - 1, Math.floor(diff / totalLength * this.frames));
            const sourceX: number = frame % this.width * screenWidth;
            const sourceY: number = Math.floor(frame / this.width) * screenHeight;
            drawImage(this.image, sourceX, sourceY, screenWidth, screenHeight, 0, 0, screenWidth, screenHeight, 8);
        }
    }

    public reset(): void {
        this.startedAt = null;
    }

    public update(): void {
        if (state.cutscene === this.slug && this.startedAt === null) {
            this.startedAt = state.now;
            if (this.audio.isPlaying() === false) {
                this.audio.setSFXVolume();
                this.audio.play(null, null);
            }
        }
        else if (this.startedAt !== null && this.permanent === false) {
            const diff: number = state.now - this.startedAt;
            const frameDuration: number = 100;
            const totalLength: number = frameDuration * this.frames;
            if (diff > totalLength) {
                this.startedAt = null;
                state.cutscene = null;
                for (const link of document.getElementsByClassName("link")) {
                    link.classList.add("hidden");
                }
                focusScreen();
            }
        }
    }
}

export default Cutscene;