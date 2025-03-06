export default class GameState {
  turnTracker;
  playerManager;
  #automatedPlayer;

  constructor(turnTracker, playerManager, automatedPlayer) {
    this.turnTracker = turnTracker;
    this.playerManager = playerManager;
    this.#automatedPlayer = automatedPlayer;
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
    if (inactivePlayerGameBoard.hitAt(position) !== null) {
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

  //returns true on success, false on failure
  endTurn() {
    if (!this.turnTracker.isGameStarted()) {
      //cannot end turn before game start
      return false;
    }

    if (!this.turnTracker.isAttackDone()) {
      //force attacking
      return false;
    }

    this.turnTracker.swapTurn();

    const nextPlayerID = this.turnTracker.activePlayer();
    const nextPlayer = this.playerManager.getPlayer(nextPlayerID);
    if (nextPlayer.isBot) {
      this.#automatedPlayer.playTurn(this);
    }

    return true;
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

  activePlayer() {
    const activePlayerID = this.turnTracker.activePlayer();
    const activePlayer = this.playerManager.getPlayer(activePlayerID);
    return activePlayer;
  }

  inactivePlayer() {
    const inactivePlayerID = this.turnTracker.inactivePlayer();
    const inactivePlayer = this.playerManager.getPlayer(inactivePlayerID);
    return inactivePlayer;
  }
}
