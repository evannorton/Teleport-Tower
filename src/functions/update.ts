import AudioSource from "../classes/AudioSource";
import Cutscene from "../classes/Cutscene";
import Definable from "../classes/Definable";
import Music from "../classes/Music";
import Player from "../classes/Player";
import Projectile from "../classes/Projectile";
import definables from "../maps/definables";
import state from "../state";

const update = (): void => {
    const audio: Map<string, Definable> | undefined = definables.get("AudioSource");
    const cutscenes: Map<string, Definable> | undefined = definables.get("Cutscene");
    const music: Map<string, Definable> | undefined = definables.get("Music");
    const players: Map<string, Definable> | undefined = definables.get("Player");
    const projectiles: Map<string, Definable> | undefined = definables.get("Projectile");
    if (document.body.classList.contains("paused") === false) {
        if (typeof cutscenes !== "undefined") {
            cutscenes.forEach((cutscene: Definable): void => {
                if (cutscene instanceof Cutscene) {
                    cutscene.update();
                }
            });
        }
        if (typeof players !== "undefined") {
            players.forEach((player: Definable): void => {
                if (player instanceof Player) {
                    player.update();
                }
            });
        }
        if (typeof projectiles !== "undefined") {
            projectiles.forEach((projectile: Definable): void => {
                if (projectile instanceof Projectile) {
                    projectile.update();
                }
            });
        }
    }
    if (typeof audio !== "undefined") {
        audio.forEach((track: Definable): void => {
            if (track instanceof AudioSource) {
                track.update();
            }
        });
    }
    if (typeof music !== "undefined") {
        music.forEach((track: Definable): void => {
            if (track instanceof Music) {
                track.update();
            }
        });
    }
    if (state.cutscene !== null && document.body.classList.contains("cutscene") === false) {
        document.body.classList.add("cutscene");
    }
    if (state.cutscene === null && document.body.classList.contains("cutscene")) {
        document.body.classList.remove("cutscene");
    }
};

export default update;