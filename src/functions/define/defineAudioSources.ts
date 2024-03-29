import AudioSource from "../../classes/AudioSource";

const defineAudioSources = (): void => {
    new AudioSource("sfx/bounce", 1);
    new AudioSource("sfx/charge", 1);
    new AudioSource("sfx/crash", 1);
    new AudioSource("sfx/credits", 1);
    new AudioSource("sfx/drums", 1);
    new AudioSource("sfx/fall", 1);
    new AudioSource("sfx/outside", 1);
    new AudioSource("sfx/teleport", 1);
};

export default defineAudioSources;