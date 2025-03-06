import GameState from "../gamestate.js";
import TurnTracker from "../turntracker.js";
import PlayerManager from "../playermanager.js";
import Player from "../player.js";
import GameBoard from "../gameboard.js";
import DumbAI from "../dumbai.js";
import AutomatedPlayer from "../automatedplayer.js";

//p1 is human, p2 is bot
//single 1 unit ship at zero
function createDefaultGameState() {
  const boardSize = 10;
  const turnTracker = new TurnTracker();
  const playerManager = new PlayerManager();

  const p1Board = new GameBoard(boardSize, boardSize);
  try {
    p1Board.placeShip({ x: 0, y: 0 }, 1, true);
  } catch (e) {
    console.log("error filling board");
  }
  const player1 = new Player(p1Board, false);

  const p2Board = new GameBoard(boardSize, boardSize);
  try {
    p2Board.placeShip({ x: 0, y: 0 }, 1, true);
  } catch (e) {
    console.log("error filling board");
  }
  const player2 = new Player(p2Board, true);

  playerManager.addPlayer(player1);
  playerManager.addPlayer(player2);

  let ai = new DumbAI();
  let automatedPlayer = new AutomatedPlayer(ai);

  const gameState = new GameState(turnTracker, playerManager, automatedPlayer);
  return gameState;
}

function createDefaultGameStateWithoutBots() {
  const boardSize = 10;
  const turnTracker = new TurnTracker();
  const playerManager = new PlayerManager();

  const p1Board = new GameBoard(boardSize, boardSize);
  try {
    p1Board.placeShip({ x: 0, y: 0 }, 1, true);
  } catch (e) {
    console.log("error filling board");
  }
  const player1 = new Player(p1Board, false);

  const p2Board = new GameBoard(boardSize, boardSize);
  try {
    p2Board.placeShip({ x: 0, y: 0 }, 1, true);
  } catch (e) {
    console.log("error filling board");
  }
  const player2 = new Player(p2Board, false);

  playerManager.addPlayer(player1);
  playerManager.addPlayer(player2);

  let ai = new DumbAI();
  let automatedPlayer = new AutomatedPlayer(ai);

  const gameState = new GameState(turnTracker, playerManager, automatedPlayer);
  return gameState;
}

export { createDefaultGameState, createDefaultGameStateWithoutBots };
