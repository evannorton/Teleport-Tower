import Definable from "./Definable";
import ImageSource from "./ImageSource";
import Renderable from "../interfaces/Renderable";
import drawImage from "../functions/draw/drawImage";
import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";
import state from "../state";

class Background extends Definable implements Renderable {
    private readonly images: ImageSource[] = [];
    private readonly maxY: number;
    public constructor(slug: string, variants: number, maxY: number) {
        super(slug);
        for (let i: number = 0; i < variants; i++) {
            this.images.push(new ImageSource(`backgrounds/${this.slug}/${i + 1}`));
        }
        this.maxY = maxY;
    }

    public render(): void {
        if (state.player !== null && state.player.isOnMap(this.slug)) {
            const y: number = state.player.getY();
            const percent: number = y / this.maxY;
            const index: number = Math.max(Math.min(Math.floor(this.images.length * percent), this.images.length - 1), 0);
            drawImage([...this.images].reverse()[index], 0, 0, screenWidth, screenHeight, 0, 0, screenWidth, screenHeight, 2);
        }
    }
}

export default Background;