import Music from "../../classes/Music";

const defineMusic = (): void => {
    new Music("inside", 3, 14.76, "part2", 87 * 16, 174 * 16);
    new Music("clouds", 4, 55.9, "part2", 0 * 16, 87 * 16);
};

export default defineMusic;