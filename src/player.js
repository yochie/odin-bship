export default class Player {
  gameBoard;
  isBot;
  #isBoardPlaced;

  constructor(gameBoard, isBot = false, isBoardPlaced = false) {
    this.gameBoard = gameBoard;
    this.isBot = isBot;
    this.#isBoardPlaced = isBoardPlaced;
  }

  isDead() {
    return this.gameBoard.isFullySunk();
  }

  isBoardPlaced() {
    return this.#isBoardPlaced;
  }

  setBoardPlaced() {
    if (this.isDead()) {
      throw new Error("Player is already dead");
    }
    this.#isBoardPlaced = true;
  }
}
