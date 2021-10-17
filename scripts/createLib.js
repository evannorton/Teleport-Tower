const { existsSync, mkdirSync, rmdirSync } = require("fs");
const { resolve } = require("path");

const path = resolve("lib");
if (existsSync(path)) {
    rmdirSync(path, { recursive: true });
}
mkdirSync(path);