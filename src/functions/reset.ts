import AudioSource from "../classes/AudioSource";
import Cutscene from "../classes/Cutscene";
import Definable from "../classes/Definable";
import definables from "../maps/definables";
import state from "../state";
import togglePause from "./togglePause";

const reset = (): void => {
    state.resetAt = state.now;
    state.pausedAudio.length = 0;
    if (state.mouseHeldAt !== null) {
        state.mouseHeldAt = state.now;
    }
    const audio: Map<string, Definable> | undefined = definables.get("AudioSource");
    if (typeof audio !== "undefined") {
        audio.forEach((track: Definable): void => {
            if (track instanceof AudioSource) {
                track.stop();
            }
        });
    }
    state.cutscene = null;
    const cutscenes: Map<string, Definable> | undefined = definables.get("Cutscene");
    if (typeof cutscenes !== "undefined") {
        cutscenes.forEach((cutscene: Definable): void => {
            if (cutscene instanceof Cutscene) {
                cutscene.reset();
            }
        });
    }
    for (const link of document.getElementsByClassName("link")) {
        link.classList.add("hidden");
    }
    if (document.body.classList.contains("paused")) {
        togglePause();
    }
    if (state.player !== null) {
        state.player.reset();
    }
};

export default reset;