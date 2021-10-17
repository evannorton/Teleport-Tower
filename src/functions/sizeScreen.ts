import screen from "../elements/screen";
import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";

const sizeScreen = (): void => {
    if (screen !== null) {
        screen.style.width = "0px";
        screen.style.height = "0px";
        if (document.body.offsetWidth / screenWidth > document.body.offsetHeight / screenHeight) {
            const height: number = Math.floor(document.body.offsetHeight);
            screen.style.width = `${Math.floor(height * screenWidth / screenHeight)}px`;
            screen.style.height = `${Math.floor(height)}px`;
        }
        else {
            const width: number = Math.floor(document.body.offsetWidth);
            screen.style.height = `${Math.floor(width * screenHeight / screenWidth)}px`;
            screen.style.width = `${Math.floor(width)}px`;
        }
    }
};

export default sizeScreen;