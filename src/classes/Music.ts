import AudioSource from "./AudioSource";
import Definable from "./Definable";

class Music extends Definable {
    private readonly audio: AudioSource[] = [];
    private readonly loopPoint: number;
    private readonly map: string;
    public constructor(slug: string, layers: number, loopPoint: number, map: string) {
        super(slug);
        for (let i: number = 0; i < layers; i++) {
            this.audio.push(new AudioSource(`music/${slug}/${i + 1}`));
        }
        this.loopPoint = loopPoint;
        this.map = map;
    }

    public getMap(): string {
        return this.map;
    }

    public play(): void {
        this.audio[0].play(this.loopPoint, null);
    }

    public stop(): void {
        this.audio.forEach((audio: AudioSource): void => {
            audio.stop();
        });
    }
}

export default Music;