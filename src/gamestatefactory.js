import GameState from "./gamestate.js";
import TurnTracker from "./turntracker.js";
import PlayerManager from "./playermanager.js";
import Player from "./player.js";
import GameBoard from "./gameboard.js";
import DumbAI from "./dumbai.js";
import AutomatedPlayer from "./automatedplayer.js";

function createPlayer(boardSize, isBot) {
  const board = createDefaultBoard(boardSize);
  const player = new Player(board, isBot);
  return player;
}

function createDefaultBoard(size) {
  const board = new GameBoard(size, size);
  try {
    board.placeShip({ x: 0, y: 0 }, 1, true);
  } catch (e) {
    console.log("error filling board");
  }
  return board;
}

//p1 is human, p2 is bot
//single 1 unit ship at zero
function createDefaultGameState() {
  const boardSize = 10;
  const turnTracker = new TurnTracker();
  const playerManager = new PlayerManager();

  let humanPlayer = createPlayer(boardSize, false);
  let botPlayer = createPlayer(boardSize, true);

  playerManager.addPlayer(humanPlayer);
  playerManager.addPlayer(botPlayer);

  let ai = new DumbAI();
  let automatedPlayer = new AutomatedPlayer(ai);

  const gameState = new GameState(turnTracker, playerManager, automatedPlayer);
  return gameState;
}

function createDefaultGameStateWithoutBots() {
  const boardSize = 10;
  const turnTracker = new TurnTracker();
  const playerManager = new PlayerManager();

  let humanPlayer1 = createPlayer(boardSize, false);
  let humanPlayer2 = createPlayer(boardSize, false);

  playerManager.addPlayer(humanPlayer1);
  playerManager.addPlayer(humanPlayer2);

  let ai = new DumbAI();
  let automatedPlayer = new AutomatedPlayer(ai);

  const gameState = new GameState(turnTracker, playerManager, automatedPlayer);
  return gameState;
}

export { createDefaultGameState, createDefaultGameStateWithoutBots };
