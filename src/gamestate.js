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

    //bot is otherwise triggered by turn end
    const firstPlayer = this.activePlayer();
    if (firstPlayer.isBot) {
      this.#automatedPlayer.playTurn(this);
    }

    //because turn start is only used to hide screen
    //when playing against human
    //on subsequent turns, turn end handles turn auto start
    if (this.playerManager.isVersusBot()) {
      this.startTurn();
    }
  }

  startTurn() {
    this.turnTracker.startTurn();
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

    if (this.playerManager.isGameOver()) {
      //cant end turn, need to restart
      return false;
    }

    this.turnTracker.swapTurn();

    const nextPlayer = this.activePlayer();
    if (nextPlayer.isBot) {
      this.#automatedPlayer.playTurn(this);
      //because we only want to trigger this from ui
      //when playing against other human
      this.startTurn();
    }

    return true;
  }

  #isAttackingAllowed() {
    if (!this.turnTracker.isGameStarted()) {
      return false;
    }
    if (!this.turnTracker.isTurnStarted()) {
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
