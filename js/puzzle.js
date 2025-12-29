import { stopTimer, restartPuzzle, exitPuzzle } from './gameLogic.js'; 
import { initCanvas, drawCanvas, getPieces } from './canvas.js';
import { playWinSound } from './audio.js';
import { playCelebrationVideo } from './video.js';

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('puzzle-canvas');
    const timerElement = document.getElementById('timer-display');
    const restartButton = document.getElementById('restart-btn');
    const exitButton = document.getElementById('exit-btn');
    const modal = document.getElementById('win-modal');
    const modalOkButton = document.getElementById('modal-ok-btn');

    let stopVideoFunction = null;

    initCanvas(canvas, `../images/${canvas.dataset.image}`);

    restartButton.addEventListener('click', () => {
        if (stopVideoFunction) { stopVideoFunction(); stopVideoFunction = null; }
        restartPuzzle(timerElement, getPieces(), drawCanvas);
    });

    exitButton.addEventListener('click', exitPuzzle);

    canvas.addEventListener('gameWon', () => {
        stopTimer();
        playWinSound(); 
        
        modal.classList.remove('hidden');
        modal.style.zIndex = "10000"; 
        
        stopVideoFunction = playCelebrationVideo(); 
    });

    modalOkButton.addEventListener('click', () => {
        if (stopVideoFunction) {
            stopVideoFunction();
            stopVideoFunction = null;
        }
        modal.classList.add('hidden');
    });
});