const PLAYER_COUNT = 2;

export default class TurnTracker {
  #playerTurn;
  #gameStarted;
  #attackDone;

  constructor() {
    this.#gameStarted = false;
    this.#playerTurn = 0;
    this.#attackDone = false;
  }

  activePlayer() {
    return this.#playerTurn;
  }

  inactivePlayer() {
    return (this.#playerTurn + 1) % PLAYER_COUNT;
  }

  attack() {
    if (!this.isGameStarted()) {
      throw new Error("Game is not started.");
    }

    if (this.#attackDone) {
      throw new Error("Already attacked this turn");
    }

    this.#attackDone = true;
  }

  startGame() {
    this.#gameStarted = true;
    this.#playerTurn = 0;
  }

  swapTurn() {
    this.#playerTurn = (this.#playerTurn + 1) % PLAYER_COUNT;
    this.#attackDone = false;
  }

  isGameStarted() {
    return this.#gameStarted;
  }

  isAttackDone() {
    return this.#attackDone;
  }
}
