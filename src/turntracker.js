const PLAYER_COUNT = 2;

export default class TurnTracker {
  #playerTurn;
  #gameStarted;
  #attackDone;
  #turnStarted;

  constructor() {
    this.#gameStarted = false;
    this.#playerTurn = -1;
    this.#attackDone = false;
    this.#turnStarted = false;
  }

  //returns index if game is applicable
  //when no active player, returns -1
  activePlayer() {
    if (!this.isGameStarted()) {
      return -1;
    }
    return this.#playerTurn;
  }

  //returns index if game is applicable
  //when no active player, returns -1
  inactivePlayer() {
    if (!this.isGameStarted()) {
      return -1;
    }
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
    if (!this.isGameStarted()) {
      throw new Error("Game not started. No turn to swap.");
    }

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
