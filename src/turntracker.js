const PLAYER_COUNT = 2;

export default class TurnTracker {
  //tracks active player
  //can be used during placement (before start)
  #playerTurn;

  //game is started after placement is done
  #gameStarted;
  #attackDone;
  #turnStarted;

  constructor() {
    this.#gameStarted = false;
    this.#playerTurn = 0;
    this.#attackDone = false;
    this.#turnStarted = false;
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

    if (!this.isTurnStarted()) {
      throw new Error("Must start turn before attacking");
    }

    if (this.#attackDone) {
      throw new Error("Already attacked this turn");
    }

    this.#attackDone = true;
  }

  startGame() {
    this.#gameStarted = true;
    this.#playerTurn = 0;
    this.#attackDone = false;
    this.#turnStarted = false;
  }

  swapTurn() {
    this.#playerTurn = (this.#playerTurn + 1) % PLAYER_COUNT;
    this.#attackDone = false;
    this.#turnStarted = false;
  }

  isGameStarted() {
    return this.#gameStarted;
  }

  isAttackDone() {
    return this.#attackDone;
  }

  isTurnStarted() {
    return this.#turnStarted;
  }

  startTurn() {
    if (!this.isGameStarted()) {
      throw new Error("Cant start turn before game");
    }

    this.#turnStarted = true;
  }
}
