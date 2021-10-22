import defineBackgrounds from "./defineBackgrounds";
import defineCutscenes from "./defineCutscenes";
import defineImageSources from "./defineImageSources";
import defineTilemaps from "./defineTilemaps";
import defineTilesets from "./defineTilesets";

const define = (): void => {
    defineImageSources();
    defineTilemaps();
    defineTilesets();
    defineBackgrounds();
    defineCutscenes();
};

export default define;