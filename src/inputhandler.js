import BoardView from "./boardview.js";

export default class InputHandler {
  uiManager;
  gameState;

  constructor(gameState, uiManager) {
    this.gameState = gameState;
    this.uiManager = uiManager;

    this.uiManager.addAttackHandler((event) => this.handleAttack(event));
    this.uiManager.addStartHandler((event) => this.handleStart(event));
    this.uiManager.addEndTurnHandler((event) => this.handleEndTurn(event));
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
}
