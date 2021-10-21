import screen from "../elements/screen";
import screenHeight from "../constants/screenHeight";
import screenWidth from "../constants/screenWidth";

const sizeScreen = (): void => {
    // FIXED SCALING
    if (screen !== null) {
        screen.style.width = `${screenWidth * 2}px`;
        screen.style.height = `${screenHeight * 2}px`;
    }
    // STRETCH SCALING
    // if (screen !== null) {
    //     screen.style.width = "0px";
    //     screen.style.height = "0px";
    //     if (document.body.offsetWidth / screenWidth > document.body.offsetHeight / screenHeight) {
    //         const height: number = Math.floor(document.body.offsetHeight);
    //         screen.style.width = `${Math.floor(height * screenWidth / screenHeight)}px`;
    //         screen.style.height = `${Math.floor(height)}px`;
    //     }
    //     else {
    //         const width: number = Math.floor(document.body.offsetWidth);
    //         screen.style.height = `${Math.floor(width * screenHeight / screenWidth)}px`;
    //         screen.style.width = `${Math.floor(width)}px`;
    //     }
    // }
    // 1:1 SCALING
    // if (screen !== null) {
    //     screen.style.width = "0px";
    //     screen.style.height = "0px";
    //     for (let i: number = 0; true; i++) {
    //         const scaledWidth: number = screenWidth * i;
    //         const scaledHeight: number = screenHeight * i;
    //         if (document.body.offsetWidth / screenWidth > document.body.offsetHeight / screenHeight) {
    //             const height: number = Math.floor(document.body.offsetHeight);
    //             const newWidth: number = Math.floor(height * screenWidth / screenHeight);
    //             const newHeight: number = Math.floor(height);
    //             if (scaledWidth > newWidth && scaledHeight > newHeight) {
    //                 break;
    //             }
    //         }
    //         else {
    //             const width: number = Math.floor(document.body.offsetWidth);
    //             const newHeight: number = Math.floor(width * screenHeight / screenWidth);
    //             const newWidth: number = Math.floor(width);
    //             if (scaledWidth > newWidth && scaledHeight > newHeight) {
    //                 break;
    //             }
    //         }
    //         screen.style.width = `${scaledWidth}px`;
    //         screen.style.height = `${scaledHeight}px`;
    //     }
    // }
};

export default sizeScreen;