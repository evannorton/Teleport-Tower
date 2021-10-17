import { BaseTexture, Texture } from "@pixi/core";
import ImageSource from "../../classes/ImageSource";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import screenHeight from "../../constants/screenHeight";
import screenWidth from "../../constants/screenWidth";
import state from "../../state";

const drawImage = (image: ImageSource, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number, x: number, y: number, width: number, height: number, zIndex: number): void => {
    if (x + width > 0 && x < screenWidth && y + height > 0 && y < screenHeight && image.getIsLoaded() && state.app !== null) {
        const texture: BaseTexture | null = image.getBaseTexture();
        if (texture !== null) {
            const chopX: number = Math.max(x * -1, 0);
            const chopY: number = Math.max(y * -1, 0);
            const adjustedX: number = Math.max(x, 0);
            const adjustedY: number = Math.max(y, 0);
            const adjustedWidth: number = Math.min(width - chopX, screenWidth - adjustedX);
            const adjustedHeight: number = Math.min(height - chopY, screenHeight - adjustedY);
            const adjustedSourceX: number = chopX + sourceX;
            const adjustedSourceY: number = chopY + sourceY;
            const adjustedSourceWidth: number = Math.min(sourceWidth - chopX, adjustedWidth);
            const adjustedSourceHeight: number = Math.min(sourceHeight - chopY, adjustedHeight);
            const sprite: Sprite = new Sprite(new Texture(texture, new Rectangle(adjustedSourceX, adjustedSourceY, adjustedSourceWidth, adjustedSourceHeight)));
            sprite.x = adjustedX;
            sprite.y = adjustedY;
            sprite.width = adjustedWidth;
            sprite.height = adjustedHeight;
            sprite.zIndex = zIndex;
            state.app.stage.addChild(sprite);
        }
    }
};

export default drawImage;