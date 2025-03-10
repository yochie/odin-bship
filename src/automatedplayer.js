export default class AutomatedPlayer {
  #ai;
  constructor(ai) {
    this.#ai = ai;
  }

  playTurn(gameState) {
    gameState.startTurn();
    const opponent = gameState.inactivePlayer();
    let opponentBoard = opponent.gameBoard;
    const target = this.#ai.chooseTarget(opponentBoard);

    gameState.attack(target);
    gameState.endTurn();
  }
}
