export default class Player {
  gameBoard;
  isBot;
  constructor(gameBoard, isBot = false) {
    this.gameBoard = gameBoard;
    this.isBot = isBot;
  }

  isDead() {
    return this.gameBoard.isFullySunk();
  }
}
