
import { playStartSound, playWinSound } from './audio.js'; 

let timerInterval = null;
let secondsElapsed = 0;

export function startTimer(timerElement) {
    if (timerInterval) {
        return;
    }
    
    playStartSound(); 

    secondsElapsed = 0;

    timerInterval = setInterval(() => {
        secondsElapsed++;
        timerElement.textContent = formatTime(secondsElapsed);
    }, 1000);
}

export function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

export function restartPuzzle(timerElement, pieces, drawCanvasCallback) {
    stopTimer();
    secondsElapsed = 0;
    timerElement.textContent = "00:00";

    pieces.forEach(piece => {
        piece.dx = piece.initialRandomX; 
        piece.dy = piece.initialRandomY;
        piece.isCorrectlyPlaced = false;
    });

    drawCanvasCallback();
}

export function exitPuzzle() {
    stopTimer();
    window.location.href = '../index.html';
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    return `${paddedMinutes}:${paddedSeconds}`;
}

export { playWinSound } from './audio.js'; 