import AudioSource from "./AudioSource";
import Definable from "./Definable";

class Music extends Definable {
    private readonly audio: AudioSource;
    private readonly loopPoint: number;
    public constructor(slug: string, loopPoint: number) {
        super(slug);
        this.audio = new AudioSource(`music/${slug}`);
        this.loopPoint = loopPoint;
    }

    public play(): void {
        this.audio.play(this.loopPoint, null);
    }

    public stop(): void {
        this.audio.stop();
    }
}

export default Music;