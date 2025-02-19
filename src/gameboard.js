import Ship from "./ship.js";

export default class Gameboard {
  //2D array
  //indicates whether each position holds a ship or not
  boardHasShip;

  //2D array
  //indicates whether each position has been hit, missed or still untouched (null)
  boardHits;

  maxX;
  maxY;

  constructor(width, height) {
    this.maxX = width - 1;
    this.maxY = height - 1;
    this.boardHasShip = [];
    this.boardHits = [];

    for (let x = 0; x < width; x++) {
      this.boardHasShip[x] = [];
      this.boardHits[x] = [];
      for (let y = 0; y < height; y++) {
        this.boardHasShip[x][y] = false;
        this.boardHits[x][y] = false;
      }
    }
  }

  placeShip(position, length, isVertical) {
    let { x: startX, y: startY } = position;
    for (let offset = 0; offset < length; offset++) {
      const x = isVertical ? startX : startX + offset;
      const y = isVertical ? startY + offset : startY;
      if (!this.#isOnBoard(x, y)) {
        throw new Error("Ship is out of bounds");
      }

      if (this.boardHasShip[x][y]) {
        throw new Error("Cannot place overlapping ships");
      }
      this.boardHasShip[x][y] = true;
    }
  }

  receiveAttack(position) {}

  isFullySunk() {}

  containsShip(position) {}

  #isOnBoard(x, y) {
    if (x < 0 || x > this.maxX) {
      return false;
    }

    if (y < 0 || y > this.maxY) {
      return false;
    }

    return true;
  }
}
