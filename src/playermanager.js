import Player from "./player.js";

export default class PlayerManager {
  #players;

  constructor() {
    this.#players = [];
  }

  addPlayer(player) {
    this.#players.push(player);
  }

  getPlayer(index) {
    if (this.#players[index] === undefined) {
      throw new Error("No player with that index");
    }

    return this.#players[index];
  }

  isGameOver() {
    for (let p of this.#players) {
      if (p.isDead()) {
        return true;
      }
    }
    return false;
  }
}
