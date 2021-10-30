import AudioSource from "./AudioSource";
import Definable from "./Definable";
import Updatable from "../interfaces/Updatable";
import musicVolume from "../elements/musicVolume";
import state from "../state";

class Music extends Definable implements Updatable {
    private readonly audio: AudioSource[] = [];
    private readonly loopPoint: number;
    private readonly map: string;
    private readonly maxY: number;
    private readonly minY: number;
    public constructor(slug: string, layers: number, loopPoint: number, map: string, minY: number, maxY: number) {
        super(slug);
        for (let i: number = 0; i < layers; i++) {
            this.audio.push(new AudioSource(`music/${slug}/${i + 1}`, 0.6));
        }
        this.loopPoint = loopPoint;
        this.map = map;
        this.minY = minY;
        this.maxY = maxY;
    }

    public getMap(): string {
        return this.map;
    }

    public hasBounds(y: number): boolean {
        return y >= this.minY && y < this.maxY;
    }

    public play(y: number): void {
        const percent: number = 1 - (y - this.minY) / (this.maxY - this.minY);
        const time: number = this.audio[0].getTime();
        for (let i: number = 0; i < this.audio.length; i++) {
            const loopPercent: number = i / this.audio.length;
            if (percent > loopPercent) {
                if (this.audio[i].isPlaying() === false) {
                    this.audio[i].seek(time);
                    this.audio[i].play(this.loopPoint, null);
                }
            }
            else if (this.audio[i].isPlaying()) {
                this.audio[i].stop();
            }
        }
    }

    public stop(): void {
        this.audio.forEach((audio: AudioSource): void => {
            if (audio.isPlaying()) {
                audio.stop();
            }
        });
    }

    public update(): void {
        if (musicVolume instanceof HTMLInputElement) {
            const fellAt: number | null = state.player === null ? null : state.player.getFellAt();
            const volume: number = Number(musicVolume.value) / 100;
            if (state.player !== null && state.player.hasCollisionOnBottom() === false && fellAt !== null && state.now - fellAt > 1000) {
                this.audio.forEach((audio: AudioSource): void => {
                    audio.setVolume(0.5 * volume);
                });
            }
            else {
                this.audio.forEach((audio: AudioSource): void => {
                    audio.setVolume(0.6 * volume);
                });
            }
        }
    }
}

export default Music;