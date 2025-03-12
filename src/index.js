import "./styles.css";
import BoardView from "./boardview.js";
import InputHandler from "./inputhandler.js";
import UIManager from "./uimanager.js";
import {
  createTestGameStatePVB,
  createTestGameStatePVP,
  createTestGameStateMultishipPVP,
} from "./gamestatefactory.js";
import PlayerView from "./playerview.js";

const gameState = createTestGameStateMultishipPVP();
const activeBoardView = new BoardView(
  document.getElementById("active-board"),
  true,
);
const inactiveBoardView = new BoardView(
  document.getElementById("opponent-board"),
  false,
);
const startButton = document.querySelector(".start-button");
const endTurnButton = document.querySelector(".end-turn-button");
const startTurnButton = document.querySelector(".start-turn-button");
const gameOverNode = document.querySelector(".game-over-screen");
const resetButton = document.querySelector(".reset-button");
const gameStartNode = document.querySelector(".game-start-screen");
const turnSwapNode = document.querySelector(".turn-swap-screen");
const instructionNode = document.querySelector(".attack-state");
const gameBoardNode = document.querySelector(".game-boards-screen");
const gameOverBoardViews = [];
gameOverBoardViews.push(
  new BoardView(document.getElementById("game-over-board-0"), true),
);
gameOverBoardViews.push(
  new BoardView(document.getElementById("game-over-board-1"), true),
);

const playerView = new PlayerView(document.querySelector(".player-view"));
const opponentView = new PlayerView(document.querySelector(".opponent-view"));

const uiManager = new UIManager(
  activeBoardView,
  inactiveBoardView,
  playerView,
  opponentView,
  startButton,
  startTurnButton,
  endTurnButton,
  resetButton,
  gameOverNode,
  gameStartNode,
  turnSwapNode,
  gameBoardNode,
  instructionNode,
  gameOverBoardViews,
);

const inputHandler = new InputHandler(gameState, uiManager);

uiManager.update(gameState);

console.log("hello");
