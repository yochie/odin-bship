export default class Ship {
  #length;
  #hitCount;

  constructor(length) {
    this.#length = length;
    this.#hitCount = 0;
  }

  hit() {
    this.#hitCount++;
  }

  isSunk() {
    return this.#hitCount === this.#length;
  }
}
