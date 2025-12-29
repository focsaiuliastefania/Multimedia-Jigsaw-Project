
const AUDIO_PATH = '../audio/';

const START_SOUND = new Audio(AUDIO_PATH + 'start.mp3');
const SNAP_SOUND = new Audio(AUDIO_PATH + 'snap.mp3');
const WIN_SOUND = new Audio(AUDIO_PATH + 'win.mp3');



export function playStartSound() {
    START_SOUND.currentTime = 0; 
    START_SOUND.play().catch(e => console.warn("Start sound error: ", e));
}

export function playSnapSound() {
    SNAP_SOUND.currentTime = 0;
    SNAP_SOUND.play().catch(e => console.warn("Snap sound error: ", e));
}

export function playWinSound() {
    WIN_SOUND.currentTime = 0;
    WIN_SOUND.play().catch(e => console.warn("Victory sound error: ", e));
}