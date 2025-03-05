export default class GameState {
  turnTracker;
  playerManager;

  constructor(turnTracker, playerManager) {
    this.turnTracker = turnTracker;
    this.playerManager = playerManager;
  }

  start() {
    this.turnTracker.startGame();
  }

  //returns true on success
  //returns false if attack fails (invalid state or target)
  //throws errors if called with bad args
  attack(position) {
    if (
      position === undefined ||
      position.x === undefined ||
      position.y === undefined
    ) {
      throw new Error(
        "Bad args. Need to provide position with x and y properties",
      );
    }

    if (!Number.isInteger(position.x) || !Number.isInteger(position.y)) {
      throw new Error(
        "Bad args. Need to provide position with integer x and y properties",
      );
    }

    if (!this.#isAttackingAllowed()) {
      return false;
    }

    const inactivePlayerId = this.turnTracker.inactivePlayer();
    const inactivePlayer = this.playerManager.getPlayer(inactivePlayerId);
    const inactivePlayerGameBoard = inactivePlayer.gameBoard;
    if (inactivePlayerGameBoard.boardHits[position.x][position.y] !== null) {
      //prevent attacking same tile
      //not throwing as this is expected to occur
      return false;
    }

    inactivePlayerGameBoard.receiveAttack(position);
    this.turnTracker.attack();
    return true;
  }

  isGameStarted() {
    return this.turnTracker.isGameStarted();
  }

  #isAttackingAllowed() {
    if (!this.turnTracker.isGameStarted()) {
      return false;
    }
    if (this.turnTracker.isAttackDone()) {
      return false;
    }
    return true;
  }
}
