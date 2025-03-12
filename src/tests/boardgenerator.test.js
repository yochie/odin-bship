import BoardGenerator from "../boardgenerator";
import { GameBoard } from "../gameboard";

describe("board generator", () => {
  test("api", () => {
    expect(BoardGenerator.generate).toBeDefined();
  });

  test("returns a gameboard", () => {
    let board = BoardGenerator.generate(10, [1]);
    expect(board).toBeInstanceOf(GameBoard);
  });

  test("returns board with correct size", () => {
    let size = 10;
    let board = BoardGenerator.generate(size, [1]);
    expect(board.width).toEqual(size);
    expect(board.height).toEqual(size);
  });

  test("throws without size", () => {
    expect(() => BoardGenerator.generate()).toThrow();
  });

  test("throws with 0 size", () => {
    expect(() => BoardGenerator.generate(0, [1])).toThrow();
  });

  test("throws with bad size type", () => {
    expect(() => BoardGenerator.generate("a", [1])).toThrow();
  });

  test("throws without ships", () => {
    let size = 10;
    expect(() => BoardGenerator.generate(size)).toThrow();
  });

  test("throws with empty ships", () => {
    expect(() => BoardGenerator.generate(1, [])).toThrow();
  });

  test("throws with non array ships", () => {
    expect(() => BoardGenerator.generate(1, 1)).toThrow();
  });

  test("throws with non int ship", () => {
    expect(() => BoardGenerator.generate(1, [1, "a"])).toThrow();
  });

  test("returns unsunk board", () => {
    let size = 10;
    let ships = [1];
    let board = BoardGenerator.generate(size, ships);
    expect(board.isFullySunk()).toBeFalsy();
  });

  test("returned board has correct number of slots filled", () => {
    const size = 10;
    const ships = [1, 2, 3, 5];
    const board = BoardGenerator.generate(size, ships);
    let count = 0;
    for (let x = 0; x < board.width; x++) {
      for (let y = 0; y < board.height; y++) {
        if (board.hasShipAt({ x, y })) {
          count++;
        }
      }
    }
    const shipsSum = ships.reduce((acc, n) => acc + n, 0);
    expect(count).toEqual(shipsSum);
  });
});
