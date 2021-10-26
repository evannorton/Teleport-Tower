import Cutscene from "../../classes/Cutscene";

const defineCutscenes = (): void => {
    new Cutscene("intro", 93, 8, false);
    new Cutscene("outro", 108, 10, true);
};

export default defineCutscenes;