import GameState from "./gamestate.js";
import TurnTracker from "./turntracker.js";
import PlayerManager from "./playermanager.js";
import Player from "./player.js";
import { GameBoard } from "./gameboard.js";
import DumbAI from "./dumbai.js";
import AutomatedPlayer from "./automatedplayer.js";
import BoardGenerator from "./boardgenerator.js";

function createPlayerWithTestBoard(isBot) {
  const board = createSingleShipTestBoard();
  const player = new Player(board, isBot, true);
  return player;
}

function createPlayerWithBoard(board, isBot, isPlaced) {
  const player = new Player(board, isBot, isPlaced);
  return player;
}

function createSingleShipTestBoard() {
  const size = 3;
  const board = new GameBoard(size, size);
  try {
    board.placeShip({ x: 0, y: 0 }, 1, true);
  } catch (e) {
    console.log("error filling board");
  }
  return board;
}

//p1 is human, p2 is bot
//uses default board (pre filled)
function createTestGameStatePVB() {
  const turnTracker = new TurnTracker();
  const playerManager = new PlayerManager();

  let humanPlayer = createPlayerWithTestBoard(false);
  let botPlayer = createPlayerWithTestBoard(true);

  playerManager.addPlayer(humanPlayer);
  playerManager.addPlayer(botPlayer);

  let ai = new DumbAI();
  let automatedPlayer = new AutomatedPlayer(ai);

  const gameState = new GameState(turnTracker, playerManager, automatedPlayer);
  return gameState;
}

//both players human
//uses default prefilled board
function createTestGameStatePVP() {
  const turnTracker = new TurnTracker();
  const playerManager = new PlayerManager();

  let p1 = createPlayerWithTestBoard(false);
  let p2 = createPlayerWithTestBoard(false);

  playerManager.addPlayer(p1);
  playerManager.addPlayer(p2);

  const gameState = new GameState(turnTracker, playerManager);
  return gameState;
}

//both players human
//fills boards with multiple ships
function createTestGameStateMultishipPVP() {
  const boardSize = 3;
  const turnTracker = new TurnTracker();
  const playerManager = new PlayerManager();

  let board1 = createSingleShipTestBoard();
  board1.placeShip({ x: 2, y: 2 }, 1, false);

  let board2 = createSingleShipTestBoard();
  board2.placeShip({ x: 2, y: 2 }, 1, false);

  let p1 = createPlayerWithBoard(board1, false, true);
  let p2 = createPlayerWithBoard(board2, false, true);

  playerManager.addPlayer(p1);
  playerManager.addPlayer(p2);

  const gameState = new GameState(turnTracker, playerManager);
  return gameState;
}

function createStartingGameStatePVP(boardSize, shipSizes) {
  const turnTracker = new TurnTracker();
  const playerManager = new PlayerManager();

  let board1 = BoardGenerator.generate(boardSize, shipSizes);
  let board2 = BoardGenerator.generate(boardSize, shipSizes);

  let p1 = createPlayerWithBoard(board1, false, false);
  let p2 = createPlayerWithBoard(board2, false, false);

  playerManager.addPlayer(p1);
  playerManager.addPlayer(p2);

  const gameState = new GameState(turnTracker, playerManager, null, shipSizes);
  return gameState;
}

function createStartingGameStatePVB(boardSize, shipSizes) {
  const turnTracker = new TurnTracker();
  const playerManager = new PlayerManager();

  let board1 = BoardGenerator.generate(boardSize, shipSizes);
  let board2 = BoardGenerator.generate(boardSize, shipSizes);

  let p1 = createPlayerWithBoard(board1, false, false);
  let p2 = createPlayerWithBoard(board2, true, true);

  playerManager.addPlayer(p1);
  playerManager.addPlayer(p2);

  let ai = new DumbAI();
  let automatedPlayer = new AutomatedPlayer(ai);

  const gameState = new GameState(
    turnTracker,
    playerManager,
    automatedPlayer,
    shipSizes,
  );
  return gameState;
}

export {
  createTestGameStatePVB,
  createTestGameStatePVP,
  createTestGameStateMultishipPVP,
  createStartingGameStatePVP,
  createStartingGameStatePVB,
};
