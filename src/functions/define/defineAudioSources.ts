import AudioSource from "../../classes/AudioSource";

const defineAudioSources = (): void => {
    new AudioSource("sfx/charge");
    new AudioSource("sfx/fall");
};

export default defineAudioSources;