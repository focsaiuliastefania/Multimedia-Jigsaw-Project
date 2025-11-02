import { startTimer, stopTimer, restartPuzzle, exitPuzzle } from './gameLogic.js';
import { initCanvas, drawCanvas, getPieces } from './canvas.js';

window.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('puzzle-canvas');
    const timerElement = document.getElementById('timer-display');
    const startButton = document.getElementById('start-btn');
    const restartButton = document.getElementById('restart-btn');
    const exitButton = document.getElementById('exit-btn');
    const modal = document.getElementById('win-modal');
    const modalOkButton = document.getElementById('modal-ok-btn');

    if (!canvas || !timerElement || !startButton || !restartButton || !exitButton || !modal || !modalOkButton) {
        console.error("Eroare: Unul sau mai multe elemente HTML nu au fost găsite. Verifică ID-urile!");
        return;
    }

    const imageName = canvas.dataset.image;

    if (!imageName) {
        console.error("EROARE: <canvas> nu are atributul 'data-image' setat în fișierul HTML!");
        return;
    }

    const imagePath = `../images/${imageName}`;

    initCanvas(canvas, imagePath);

    startButton.addEventListener('click', () => {
        startTimer(timerElement);
    });

    restartButton.addEventListener('click', () => {
        const allPieces = getPieces();
        restartPuzzle(timerElement, allPieces, drawCanvas);
    });

    exitButton.addEventListener('click', () => {
        exitPuzzle();
    });

    canvas.addEventListener('gameWon', () => {
        stopTimer();
        modal.classList.remove('hidden');
    });

    modalOkButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
});