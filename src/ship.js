export default class Ship {
  #length;
  #hitCount;

  constructor(length) {
    this.#length = length;
    this.#hitCount = 0;
  }

  hit() {
    if (this.isSunk()) {
      throw new Error("Ship is already sunk. You shouldn't be able to hit it.");
    }
    this.#hitCount++;
  }

  isSunk() {
    return this.#hitCount === this.#length;
  }

  getLength() {
    return this.#length;
  }
}
