import state from "../state";

const unlockMedal = (medalID: number): void => {
    if (state.achievements.includes(medalID) === false && window.ngio.user !== null) {
        state.achievements.push(medalID);
        window.ngio.callComponent("Medal.unlock", { id: medalID });
    }
};

export default unlockMedal;