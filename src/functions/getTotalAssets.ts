import Definable from "../classes/Definable";
import definables from "../maps/definables";

const getTotalAssets = (): number => {
    const audio: Map<string, Definable> | undefined = definables.get("AudioSource");
    const images: Map<string, Definable> | undefined = definables.get("ImageSource");
    if (typeof audio !== "undefined" && typeof images !== "undefined") {
        return audio.size + images.size;
    }
    return 0;
};

export default getTotalAssets;