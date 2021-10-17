import sizeScreen from "./sizeScreen";

const listenToDOM = (): void => {
    addEventListener("resize", (): void => {
        sizeScreen();
    });
};

export default listenToDOM;