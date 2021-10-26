import state from "../state";

const takeScreenshot = (): void => {
    if (state.app !== null) {
        const anchor: HTMLAnchorElement = document.createElement("a");
        anchor.download = "Teleport Tower Screenshot.png";
        anchor.href = state.app.renderer.plugins.extract.canvas(state.app.stage).toDataURL();
        anchor.click();
    }
};

export default takeScreenshot;