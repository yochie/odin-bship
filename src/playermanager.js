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

  getIndex(player) {
    return this.#players.indexOf(player);
  }

  isGameOver() {
    for (let p of this.#players) {
      if (p.isDead()) {
        return true;
      }
    }
    return false;
  }

  isVersusBot() {
    if (this.#players.length === 0) {
      throw new Error("No players registered");
    }
    for (let p of this.#players) {
      if (p.isBot) {
        return true;
      }
    }
    return false;
  }

  isPlacementDone() {
    if (this.#players.length === 0) {
      return false;
    }
    for (let p of this.#players) {
      if (!p.isBoardPlaced()) {
        return false;
      }
    }
    return true;
  }
}
