import state from "../state";

const getRunTime = (): string => {
    if (state.runEndedAt === null) {
        return "0";
    }
    let time: number = Math.floor(state.runEndedAt - state.resetAt);
    let hours: number = 0;
    let minutes: number = 0;
    let seconds: number = 0;
    let ms: number = 0;
    while (time > 0) {
        if (time >= 3600000) {
            hours++;
            time -= 3600000;
        }
        else if (time >= 60000) {
            minutes++;
            time -= 60000;
        }
        else if (time >= 1000) {
            seconds++;
            time -= 1000;
        }
        else {
            ms += time;
            time = 0;
        }
    }
    const pieces: string[] = [];
    // Hours
    if (hours > 0) {
        pieces.push(String(hours));
    }
    // Minutes
    pieces.push(String(minutes).padStart(2, "0"));
    // Seconds
    pieces.push(String(seconds).padStart(2, "0"));
    // Milliseconds
    pieces.push(String(ms).padStart(3, "0"));
    return pieces.join(":");
};

export default getRunTime;