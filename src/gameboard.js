import Ship from "./ship.js";

const HIT = "hit";
const MISS = "miss";

export default class Gameboard {
  //2D array
  //indicates whether each position has been hit, missed or still untouched (null)
  #hitPositions;

  //2D array pointing to ships at each position
  #shipPositions;

  //list of ships on board
  #ships;

  #lastHitPosition;

  width;
  height;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.#hitPositions = [];
    this.#shipPositions = [];
    this.#ships = [];
    this.#lastHitPosition = null;

    for (let x = 0; x < width; x++) {
      this.#shipPositions[x] = [];
      this.#hitPositions[x] = [];
      for (let y = 0; y < height; y++) {
        this.#shipPositions[x][y] = null;
        this.#hitPositions[x][y] = null;
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

      if (this.#shipPositions[x][y]) {
        throw new Error("Cannot place overlapping ships");
      }
    }

    //do a second pass that actually modifies state now that we know
    //modification is valid
    const ship = new Ship(length);
    for (let offset = 0; offset < length; offset++) {
      const x = isVertical ? startX : startX + offset;
      const y = isVertical ? startY + offset : startY;
      this.#shipPositions[x][y] = ship;
    }

    this.#ships.push(ship);
  }

  receiveAttack(position) {
    const { x, y } = position;
    if (this.#hitPositions[x][y] !== null) {
      throw new Error("Cannot attack same position twice");
    }

    if (this.#shipPositions[x][y]) {
      this.#hitPositions[x][y] = HIT;
      this.#shipPositions[x][y].hit();
    } else {
      this.#hitPositions[x][y] = MISS;
    }

    this.#lastHitPosition = position;
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
    if (x < 0 || x >= this.width) {
      return false;
    }

    if (y < 0 || y >= this.height) {
      return false;
    }

    return true;
  }

  hitAt(position) {
    return this.#hitPositions[position.x][position.y];
  }

  hasShipAt(position) {
    return this.#shipPositions[position.x][position.y] !== null;
  }

  lastAttackLanded() {
    const position = this.#lastHitPosition;
    if (position === null) {
      return false;
    }
    return this.#hitPositions[position.x][position.y] === HIT;
  }

  lastHitPosition() {
    return this.#lastHitPosition;
  }
}
