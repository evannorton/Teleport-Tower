import defineBackgrounds from "./defineBackgrounds";
import defineCutscenes from "./defineCutscenes";
import defineImageSources from "./defineImageSources";
import defineTilemaps from "./defineTilemaps";
import defineTilesets from "./defineTilesets";
import defineTransports from "./defineTransports";

const define = (): void => {
    defineImageSources();
    defineTilemaps();
    defineTilesets();
    defineBackgrounds();
    defineCutscenes();
    defineTransports();
};

export default define;