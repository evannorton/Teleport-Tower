import Definable from "./Definable";
import { Howl } from "howler";
import Updatable from "../interfaces/Updatable";
import musicVolume from "../elements/musicVolume";
import sfxVolume from "../elements/sfxVolume";

class AudioSource extends Definable implements Updatable {
    private fadingIn: boolean = false;
    private fadingOut: boolean = false;
    private readonly initialVolume: number;
    private loopPoint: number | null = null;
    private muted: boolean = false;
    private onPlay: (() => void) | null = null;
    private plays: number = 0;
    private readonly howl: Howl;
    public constructor(slug: string, volume: number) {
        super(slug);
        this.howl = new Howl({
            loop: false,
            preload: true,
            src: [this.getSRC()],
            volume
        });
        this.initialVolume = volume;
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

    public fadeIn(duration: number, max: number): void {
        this.fadingIn = true;
        this.howl.fade(0, max, duration);
    }

    public fadeOut(duration: number): void {
        this.fadingOut = true;
        this.howl.fade(1, 0, duration);
    }

    public getLoopPoint(): number | null {
        return this.loopPoint;
    }

    public getSRC(): string {
        return `./audio/${this.slug}.mp3`;
    }

    public getTime(): number {
        return this.howl.seek();
    }

    public getVolume(): number {
        return this.howl.volume();
    }

    public isPlaying(): boolean {
        return this.howl.playing();
    }

    public pause(): void {
        this.howl.pause();
    }

    public play(loopPoint: number | null, onPlay: (() => void) | null, override?: boolean): void {
        this.loopPoint = loopPoint;
        this.onPlay = onPlay;
        if (override === true || this.isPlaying() === false) {
            this.howl.play();
        }
    }

    public seek(time: number): void {
        this.howl.seek(time);
    }

    public setSFXVolume(): void {
        if (sfxVolume instanceof HTMLInputElement) {
            const volume: number = Number(sfxVolume.value) / 100;
            this.setVolume(this.initialVolume * volume);
        }
    }

    public setVolume(volume: number): void {
        this.howl.volume(volume);
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

    public update(): void {
        if (musicVolume instanceof HTMLInputElement) {
            if (this.slug === "sfx/outside" || this.slug === "sfx/credits") {
                const volume: number = Number(musicVolume.value) / 100;
                this.setVolume(this.initialVolume * volume);
            }
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