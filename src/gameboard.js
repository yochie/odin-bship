import Ship from "./ship.js";

export default class Gameboard {
  //2D array
  //indicates whether each position holds a ship or not
  boardHasShip;

  //2D array
  //indicates whether each position has been hit, missed or still untouched (null)
  boardHits;

  //2D array pointing to ships at each position
  #boardShips;

  //list of ships on board without positions
  #ships;

  maxX;
  maxY;

  constructor(width, height) {
    this.maxX = width - 1;
    this.maxY = height - 1;
    this.boardHasShip = [];
    this.boardHits = [];
    this.#boardShips = [];
    this.#ships = [];

    for (let x = 0; x < width; x++) {
      this.boardHasShip[x] = [];
      this.boardHits[x] = [];
      this.#boardShips[x] = [];
      for (let y = 0; y < height; y++) {
        this.boardHasShip[x][y] = false;
        this.boardHits[x][y] = null;
        this.#boardShips[x][y] = null;
      }
    }
  }

  placeShip(position, length, isVertical) {
    let { x: startX, y: startY } = position;

    //do a first pass over all occupied positions to ensure they are valid
    for (let offset = 0; offset < length; offset++) {
      const x = isVertical ? startX : startX + offset;
      const y = isVertical ? startY + offset : startY;
      if (!this.#isOnBoard(x, y)) {
        throw new Error("Ship is out of bounds");
      }

      if (this.boardHasShip[x][y]) {
        throw new Error("Cannot place overlapping ships");
      }
    }

    //do a second pass that actually modifies state now that we know
    //modification is valid
    const ship = new Ship(length);
    for (let offset = 0; offset < length; offset++) {
      const x = isVertical ? startX : startX + offset;
      const y = isVertical ? startY + offset : startY;
      this.boardHasShip[x][y] = true;
      this.#boardShips[x][y] = ship;
    }

    this.#ships.push(ship);
  }

  receiveAttack(position) {
    const { x, y } = position;
    if (this.boardHits[x][y] !== null) {
      throw new Error("Cannot attack same position twice");
    }

    if (this.boardHasShip[x][y]) {
      this.boardHits[x][y] = "hit";
      this.#boardShips[x][y].hit();
    } else {
      this.boardHits[x][y] = "miss";
    }
  }

  isFullySunk() {
    for (let ship of this.#ships) {
      if (!ship.isSunk()) {
        return false;
      }
    }
    return true;
  }

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
