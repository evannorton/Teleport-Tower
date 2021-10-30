import Cutscene from "../classes/Cutscene";
import Definable from "../classes/Definable";
import definables from "../maps/definables";
import state from "../state";

const interact = (): void => {
    if (state.interactedAt === null) {
        state.interactedAt = state.now;
        if (state.cutscene !== null) {
            const cutscenes: Map<string, Definable> | undefined = definables.get("Cutscene");
            if (typeof cutscenes !== "undefined") {
                const cutscene: Definable | undefined = cutscenes.get(state.cutscene);
                if (cutscene instanceof Cutscene) {
                    cutscene.getAudio().seek(state.interactedAt / 1000);
                    cutscene.getAudio().play(null, null);
                }
            }
        }
    }
};

export default interact;