import Definable from "./Definable";
import { Howl } from "howler";

class AudioSource extends Definable {
    private fadingIn: boolean = false;
    private fadingOut: boolean = false;
    private loopPoint: number | null = null;
    private onPlay: (() => void) | null = null;
    private plays: number = 0;
    private readonly howl: Howl;
    public constructor(slug: string) {
        super(slug);
        this.howl = new Howl({
            loop: false,
            preload: true,
            src: [this.getSRC()]
        });
        this.howl.on("end", (): void => {
            if (this.loopPoint !== null) {
                this.howl.seek(this.loopPoint);
                this.play(this.loopPoint, this.onPlay);
            }
        });
        this.howl.on("fade", (): void => {
            this.onHowlFade();
        });
        this.howl.on("play", (): void => {
            this.onHowlPlay();
        });
    }

    public getSRC(): string {
        return `./audio/${this.slug}.mp3`;
    }

    public play(loopPoint: number | null, onPlay: (() => void) | null): void {
        this.loopPoint = loopPoint;
        this.onPlay = onPlay;
        this.howl.play();
    }

    public stop(): void {
        this.howl.stop();
    }

    public fadeOut(duration: number): void {
        this.fadingOut = true;
        this.howl.fade(this.howl.volume(), 0, duration);
    }

    private onHowlFade(): void {
        if (this.fadingIn) {
            this.fadingIn = false;
        }
        if (this.fadingOut) {
            this.stop();
            this.fadingOut = false;
        }
    }

    private onHowlPlay(): void {
        if (this.plays === 0 && this.onPlay !== null) {
            this.onPlay();
        }
        this.plays++;
    }
}

export default AudioSource;