import AudioSource from "../classes/AudioSource";
import Definable from "../classes/Definable";
import definables from "../maps/definables";
import focusScreen from "./focusScreen";
import state from "../state";

const togglePause = (): void => {
    if (state.cutscene === null) {
        if (document.body.classList.contains("paused")) {
            document.body.classList.remove("paused");
            state.pausedAudio.forEach((track: AudioSource): void => {
                track.setSFXVolume();
                track.play(track.getLoopPoint(), null);
            });
            state.pausedAudio.length = 0;
        }
        else {
            document.body.classList.add("paused");
            const audio: Map<string, Definable> | undefined = definables.get("AudioSource");
            if (typeof audio !== "undefined") {
                audio.forEach((track: Definable): void => {
                    if (track instanceof AudioSource && track.isPlaying() && track.getSlug().includes("music/") === false && track.getSlug() !== "sfx/outside") {
                        track.pause();
                        state.pausedAudio.push(track);
                    }
                });
            }
        }
    }
    focusScreen();
};

export default togglePause;