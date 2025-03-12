import { GameBoard } from "./gameboard.js";

export default class BoardGenerator {
  constructor() {}

  //will loop inifinitely if not possible
  //be careful!!!!
  static generate(size, ships) {
    if (
      !size ||
      !Number.isInteger(size) ||
      !ships ||
      !Array.isArray(ships) ||
      ships.length === 0
    ) {
      throw new Error("Requires integer size + integer array ships");
    }

    if (ships.some((s) => !Number.isInteger(s))) {
      throw new Error("Ships array must be integers");
    }

    const board = new GameBoard(size, size);
    for (const shipLength of ships) {
      let placed;
      //careful!!!
      //if we attempt to place impossible ship, will loop infinitely
      do {
        const vertical = Math.random() < 0.5;
        const x = Math.floor(Math.random() * board.width);
        const y = Math.floor(Math.random() * board.height);
        const position = { x, y };
        placed = board.placeShip(position, shipLength, vertical);
      } while (!placed);
    }

    return board;
  }
}
