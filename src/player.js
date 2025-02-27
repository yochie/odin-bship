export default class Player {
  gameboard;
  isBot;
  constructor(gameboard, isBot = false) {
    this.gameboard = gameboard;
    this.isBot = isBot;
  }
}
