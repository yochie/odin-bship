import "./styles.css";
import GameState from "./gamestate.js";
import BoardView from "./boardview.js";
import InputHandler from "./inputhandler.js";
import UIManager from "./uimanager.js";
import TurnTracker from "./turntracker.js";
import PlayerManager from "./playermanager.js";
import Player from "./player.js";
import GameBoard from "./gameboard.js";
import {
  createDefaultGameState,
  createDefaultGameStateWithoutBots,
  createRicherGameState,
} from "./gamestatefactory.js";

const gameState = createRicherGameState();
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
const gameOverNode = document.querySelector(".game-over-screen");
const resetButton = document.querySelector(".reset-button");
const gameStartNode = document.querySelector(".game-start-screen");
const instructionNode = document.querySelector(".attack-state");
const gameBoardNode = document.querySelector(".game-boards-screen");
const gameOverBoardViews = [];
gameOverBoardViews.push(
  new BoardView(document.getElementById("game-over-board-0"), true),
);
gameOverBoardViews.push(
  new BoardView(document.getElementById("game-over-board-1"), true),
);

const uiManager = new UIManager(
  activeBoardView,
  inactiveBoardView,
  startButton,
  endTurnButton,
  gameOverNode,
  resetButton,
  gameStartNode,
  instructionNode,
  gameBoardNode,
  gameOverBoardViews,
);

const inputHandler = new InputHandler(gameState, uiManager);

uiManager.update(gameState);

console.log("hello");
