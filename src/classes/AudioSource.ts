import Definable from "./Definable";
import { Howl } from "howler";

class AudioSource extends Definable {
    private fadingIn: boolean = false;
    private fadingOut: boolean = false;
    private loopPoint: number | null = null;
    private muted: boolean = false;
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
                this.seek(this.loopPoint);
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

    public fadeOut(duration: number): void {
        this.fadingOut = true;
        this.howl.fade(this.howl.volume(), 0, duration);
    }

    public getSRC(): string {
        return `./audio/${this.slug}.mp3`;
    }

    public getTime(): number {
        return this.howl.seek();
    }

    public isPlaying(): boolean {
        return this.howl.playing();
    }

    public play(loopPoint: number | null, onPlay: (() => void) | null): void {
        this.loopPoint = loopPoint;
        this.onPlay = onPlay;
        this.howl.play();
    }

    public seek(time: number): void {
        this.howl.seek(time);
    }

    public stop(): void {
        this.howl.stop();
    }

    public toggleMute(): void {
        if (this.muted) {
            this.unmute();
        }
        else {
            this.mute();
        }
    }

    private mute(): void {
        this.muted = true;
        this.howl.mute(true);
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

    private unmute(): void {
        this.muted = false;
        this.howl.mute(false);
    }
}

export default AudioSource;