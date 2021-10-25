import ImageSource from "../../classes/ImageSource";

const defineImageSources = (): void => {
    new ImageSource("meter");
    new ImageSource("portal");
    new ImageSource("player");
    new ImageSource("projectile");
};

export default defineImageSources;