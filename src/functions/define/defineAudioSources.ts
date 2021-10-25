import AudioSource from "../../classes/AudioSource";

const defineAudioSources = (): void => {
    new AudioSource("sfx/charge", 1);
    new AudioSource("sfx/drums", 1);
    new AudioSource("sfx/fall", 1);
};

export default defineAudioSources;