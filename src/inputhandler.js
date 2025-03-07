import BoardView from "./boardview.js";
import { createDefaultGameState } from "./gamestatefactory.js";

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
  }

  handleAttack(event) {
    if (!this.gameState.isGameStarted()) {
      return;
    }

    let position = BoardView.parsePosition(event.target);
    const attackSuccess = this.gameState.attack(position);
    if (!attackSuccess) {
      return;
    }
    this.uiManager.update(this.gameState);
  }

  handleStart(event) {
    this.gameState.start();
    this.uiManager.update(this.gameState);
  }

  handleEndTurn(envent) {
    const success = this.gameState.endTurn();
    if (!success) {
      return;
    }

    this.uiManager.update(this.gameState);
  }

  handleReset(event) {
    //rather than mutate current gamestate, just create a whole new one
    this.gameState = createDefaultGameState();
    this.uiManager.update(this.gameState);
  }
}
