import { startTimer } from "./gameLogic.js";

import { playSnapSound } from "./audio.js"; 


let ctx;
let puzzleImage;
let pieces = [];
let canvasWidth, canvasHeight;

const PUZZLE_ROWS = 3;
const PUZZLE_COLS = 3;
let pieceWidth, pieceHeight;

const SOLUTION_AREA = { x: 25, y: 25, width: 450, height: 450 };
const PIECE_AREA = { x: 500, y: 0, width: 300, height: 500 };

let isDragging = false;
let selectedPiece = null;
let offsetX, offsetY;

export function initCanvas(canvasElement, imageUrl) {
  ctx = canvasElement.getContext("2d");
  canvasWidth = canvasElement.width;
  canvasHeight = canvasElement.height;

  puzzleImage = new Image();
  puzzleImage.src = imageUrl;

  puzzleImage.onload = () => {
    pieceWidth = puzzleImage.width / PUZZLE_COLS;
    pieceHeight = puzzleImage.height / PUZZLE_ROWS;

    createPieces();
    shufflePieces();
    drawCanvas();

    canvasElement.addEventListener("mousedown", onMouseDown);
    canvasElement.addEventListener("mousemove", onMouseMove);
    canvasElement.addEventListener("mouseup", onMouseUp);
    canvasElement.addEventListener("mouseout", onMouseUp);
  };
}

export function drawCanvas() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawLayout();
  drawGrid();

  ctx.globalAlpha = 0.3;
  ctx.drawImage(
    puzzleImage,
    SOLUTION_AREA.x,
    SOLUTION_AREA.y,
    SOLUTION_AREA.width,
    SOLUTION_AREA.height
  );
  ctx.globalAlpha = 1.0;

  pieces.forEach((piece) => {
    ctx.drawImage(
      puzzleImage,
      piece.sx,
      piece.sy,
      pieceWidth,
      pieceHeight,
      piece.dx,
      piece.dy,
      piece.width,
      piece.height
    );
    ctx.strokeRect(piece.dx, piece.dy, piece.width, piece.height);
  });
}

export function getPieces() {
  return pieces;
}

function drawLayout() {
  ctx.fillStyle = "rgba(151, 126, 218, 0.9)";
  ctx.fillRect(PIECE_AREA.x, PIECE_AREA.y, PIECE_AREA.width, PIECE_AREA.height);
  ctx.beginPath();
  ctx.rect(PIECE_AREA.x, PIECE_AREA.y, PIECE_AREA.width, PIECE_AREA.height);
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Puzzle Pieces", PIECE_AREA.x + PIECE_AREA.width / 2, 30);
}

function createPieces() {
  pieces = [];
  const scaledPieceWidth = SOLUTION_AREA.width / PUZZLE_COLS;
  const scaledPieceHeight = SOLUTION_AREA.height / PUZZLE_ROWS;

  for (let i = 0; i < PUZZLE_ROWS; i++) {
    for (let j = 0; j < PUZZLE_COLS; j++) {
      const piece = {
        sx: j * pieceWidth,
        sy: i * pieceHeight,
        correctX: j * scaledPieceWidth + SOLUTION_AREA.x,
        correctY: i * scaledPieceHeight + SOLUTION_AREA.y,
        dx: 0,
        dy: 0,
        width: scaledPieceWidth,
        height: scaledPieceHeight,
        isCorrectlyPlaced: false,
      };
      pieces.push(piece);
    }
  }
}

function shufflePieces() {
  pieces.forEach((piece) => {
    const randomX =
      PIECE_AREA.x + Math.random() * (PIECE_AREA.width - piece.width);
    const randomY =
      50 +
      PIECE_AREA.y +
      Math.random() * (PIECE_AREA.height - piece.height - 50);

    piece.dx = randomX;
    piece.dy = randomY;

    piece.initialRandomX = randomX; 
    piece.initialRandomY = randomY; 

    piece.isCorrectlyPlaced = false;
  });
}

function drawGrid() {
  ctx.strokeStyle = "#AAA";
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let i = 0; i <= PUZZLE_COLS; i++) {
    const x = SOLUTION_AREA.x + i * (SOLUTION_AREA.width / PUZZLE_COLS);
    ctx.moveTo(x, SOLUTION_AREA.y);
    ctx.lineTo(x, SOLUTION_AREA.y + SOLUTION_AREA.height);
  }
  for (let i = 0; i <= PUZZLE_ROWS; i++) {
    const y = SOLUTION_AREA.y + i * (SOLUTION_AREA.height / PUZZLE_ROWS);
    ctx.moveTo(SOLUTION_AREA.x, y);
    ctx.lineTo(SOLUTION_AREA.x + SOLUTION_AREA.width, y);
  }

  ctx.stroke();
}

function getMousePos(e) {
  const rect = ctx.canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function onMouseDown(e) {
  const mousePos = getMousePos(e);

  for (let i = pieces.length - 1; i >= 0; i--) {
    const piece = pieces[i];
    if (piece.isCorrectlyPlaced) continue;

    if (
      mousePos.x > piece.dx &&
      mousePos.x < piece.dx + piece.width &&
      mousePos.y > piece.dy &&
      mousePos.y < piece.dy + piece.height
    ) {
      isDragging = true;
      selectedPiece = piece;
      offsetX = mousePos.x - piece.dx;
      offsetY = mousePos.y - piece.dy;

      pieces.splice(i, 1);
      pieces.push(selectedPiece);
      break;
    }
  }
}

function onMouseMove(e) {
  if (!isDragging || !selectedPiece) return;
  const mousePos = getMousePos(e);

  selectedPiece.dx = mousePos.x - offsetX;
  selectedPiece.dy = mousePos.y - offsetY;
  drawCanvas();
}

function onMouseUp(e) {
  if (!isDragging || !selectedPiece) {
    isDragging = false;
    return;
  }

  isDragging = false;

  const timerElement = document.getElementById("timer-display");
  startTimer(timerElement);

  const snapTolerance = 15;

  if (
    Math.abs(selectedPiece.dx - selectedPiece.correctX) < snapTolerance &&
    Math.abs(selectedPiece.dy - selectedPiece.correctY) < snapTolerance
  ) {
    selectedPiece.dx = selectedPiece.correctX;
    selectedPiece.dy = selectedPiece.correctY;
    selectedPiece.isCorrectlyPlaced = true;
    playSnapSound();
  
  }

  selectedPiece = null;
  drawCanvas();
  checkWinCondition();
}


function checkWinCondition() {
  const allPlaced = pieces.every((piece) => piece.isCorrectlyPlaced);

  if (allPlaced) {
    const winEvent = new Event("gameWon");
    ctx.canvas.dispatchEvent(winEvent);
  }
}
