import defineBackgrounds from "./defineBackgrounds";
import defineCutscenes from "./defineCutscenes";
import defineImageSources from "./defineImageSources";
import defineMusic from "./defineMusic";
import defineTilemaps from "./defineTilemaps";
import defineTilesets from "./defineTilesets";
import defineTransports from "./defineTransports";

const define = (): void => {
    defineImageSources();
    defineMusic();
    defineTilemaps();
    defineTilesets();
    defineBackgrounds();
    defineCutscenes();
    defineTransports();
};

export default define;