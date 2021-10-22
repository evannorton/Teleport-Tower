import Definable from "./Definable";
import ImageSource from "./ImageSource";
import Renderable from "../interfaces/Renderable";
import drawImage from "../functions/draw/drawImage";
import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";
import state from "../state";

class Background extends Definable implements Renderable {
    private readonly image: ImageSource;
    public constructor(slug: string) {
        super(slug);
        this.image = new ImageSource(`backgrounds/${this.slug}`);
    }

    public render(): void {
        if (state.player !== null && state.player.isOnMap(this.slug)) {
            drawImage(this.image, 0, 0, screenWidth, screenHeight, 0, 0, screenWidth, screenHeight, 2);
        }
    }
}

export default Background;