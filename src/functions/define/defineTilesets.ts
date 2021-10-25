import Tileset from "../../classes/Tileset";

const defineTilesets = (): void => {
    new Tileset("clouds", 10, 87 * 16);
    new Tileset("python", 1, Infinity);
    new Tileset("sign", 1, Infinity);
    new Tileset("street", 1, Infinity);
    new Tileset("transports", 1, Infinity);
    new Tileset("wall", 1, Infinity);
};

export default defineTilesets;