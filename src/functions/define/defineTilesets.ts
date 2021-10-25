import Tileset from "../../classes/Tileset";

const defineTilesets = (): void => {
    new Tileset("clouds");
    new Tileset("python");
    new Tileset("sign");
    new Tileset("street");
    new Tileset("transports");
    new Tileset("wall");
};

export default defineTilesets;