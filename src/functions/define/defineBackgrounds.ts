import Background from "../../classes/Background";

const defineBackgrounds = (): void => {
    new Background("part1", 1, 154 * 16);
    new Background("part2", 10, 87 * 16);
};

export default defineBackgrounds;