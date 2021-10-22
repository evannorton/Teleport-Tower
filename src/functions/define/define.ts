import defineBackgrounds from "./defineBackgrounds";
import defineImageSources from "./defineImageSources";
import defineTilemaps from "./defineTilemaps";
import defineTilesets from "./defineTilesets";

const define = (): void => {
    defineImageSources();
    defineTilemaps();
    defineTilesets();
    defineBackgrounds();
};

export default define;