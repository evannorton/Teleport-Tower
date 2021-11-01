import getTotalAssets from "./getTotalAssets";
import state from "../state";

const handleAssetLoad = (): void => {
    state.loadedAssets++;
    if (state.loadedAssets === getTotalAssets()) {
        document.body.classList.remove("loading");
    }
};

export default handleAssetLoad;