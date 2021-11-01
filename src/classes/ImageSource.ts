import { BaseTexture, Loader, Texture } from "pixi.js";
import Definable from "./Definable";
import state from "../state";

class ImageSource extends Definable {
    private isLoaded: boolean = false;
    private readonly loader: Loader = new Loader;

    public constructor(slug: string) {
        super(slug);
        this.loader.add(this.getSRC()).load((): void => {
            this.isLoaded = true;
            state.loadedAssets++;
        });
    }

    public getBaseTexture(): BaseTexture | null {
        const texture: Texture | undefined = this.loader.resources[this.getSRC()].texture;
        return typeof texture === "undefined" ? null : texture.baseTexture;
    }

    public getIsLoaded(): boolean {
        return this.isLoaded;
    }

    public getLoader(): Loader {
        return this.loader;
    }

    public getSRC(): string {
        return `./images/${this.slug}.png`;
    }
}

export default ImageSource;