import Tileset from "../../classes/Tileset";

const defineTilesets = (): void => {
    new Tileset("street");
    new Tileset("transports");
    new Tileset("wall");
};

export default defineTilesets;