import BoardGenerator from "./boardgenerator.js";
import BoardView from "./boardview.js";
import { createTestGameStatePVB } from "./gamestatefactory.js";

//defines handlers for ui events
//these handlers usually alter the game state in some fashion
//they also request ui updates given the altered gamestate when applicable
//uimanager itself is sole responsible of updating ui state in response to ui events
//input handler should  only manage gamestate changes
export default class InputHandler {
  uiManager;
  gameState;

  constructor(gameState, uiManager) {
    this.gameState = gameState;
    this.uiManager = uiManager;

    this.uiManager.addAttackHandler((event) => this.handleAttack(event));
    this.uiManager.addStartHandler((event) => this.handleStart(event));
    this.uiManager.addEndTurnHandler((event) => this.handleEndTurn(event));
    this.uiManager.addResetHandler((event) => this.handleReset(event));
    this.uiManager.addStartTurnHandler((event) => this.handleStartTurn(event));
    this.uiManager.addGenerateBoardHandler((event) =>
      this.handleGenerateBoard(event),
    );
    this.uiManager.addPlacementDoneHandler((event) =>
      this.handlePlacementDone(event),
    );
  }

  handleAttack(event) {
    if (!this.gameState.isGameStarted()) {
      return this.gameState;
    }

    let position = BoardView.parsePosition(event.target);
    this.gameState.attack(position);
    return this.gameState;
  }

  handleStart(event) {
    this.gameState.start();
    return this.gameState;
  }

  handleEndTurn(event) {
    this.gameState.endTurn();
    return this.gameState;
  }

  handleReset(event) {
    //rather than mutate current gamestate, just create a whole new one
    this.gameState = createTestGameStatePVB();
    return this.gameState;
  }

  handleStartTurn(event) {
    this.gameState.startTurn();
    return this.gameState;
  }

  handleGenerateBoard(event) {
    const player = this.gameState.activePlayer();
    const previousBoard = player.gameBoard;
    const boardSize = previousBoard.width;
    player.gameBoard = BoardGenerator.generate(
      boardSize,
      this.gameState.shipSizes,
    );

    return this.gameState;
  }

  handlePlacementDone(event) {
    const player = this.gameState.activePlayer();
    player.setBoardPlaced();
    if (!this.gameState.playerManager.isPlacementDone()) {
      this.gameState.turnTracker.swapTurn();
    } else {
      const goFirst = Math.random() < 0.5;
      if (!goFirst) {
        this.gameState.turnTracker.swapTurn();
      }
    }
    return this.gameState;
  }
}
