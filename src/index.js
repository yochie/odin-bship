import "./styles.css";
import GameState from "./gamestate.js";
import BoardView from "./boardview.js";
import InputHandler from "./inputhandler.js";
import UIManager from "./uimanager.js";
import TurnTracker from "./turntracker.js";
import PlayerManager from "./playermanager.js";
import Player from "./player.js";
import GameBoard from "./gameboard.js";
import { createDefaultGameState } from "./tests/mother.js";

const gameState = createDefaultGameState();
const activeBoardView = new BoardView("active-board", true);
const inactiveBoardView = new BoardView("opponent-board", false);
const startButton = document.querySelector(".start-button");

const uiManager = new UIManager(
  activeBoardView,
  inactiveBoardView,
  startButton,
);

const inputHandler = new InputHandler(gameState, uiManager);

uiManager.update(gameState);

gameState.sta;

console.log("hello");
