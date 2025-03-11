import DumbAI from "../dumbai";
import { GameBoard } from "../gameboard";

describe("dumb ai", () => {
  let ai;
  let board;

  beforeAll(() => {
    ai = new DumbAI();
  });

  beforeEach(() => {
    board = new GameBoard(10, 10);
    board.placeShip({ x: 0, y: 0 }, 1, false);
  });

  test("api", () => {
    expect(ai.chooseTarget).toBeDefined();
  });

  test("returns a position object with x and y properties", () => {
    let result = ai.chooseTarget(board);
    expect(result.x).toBeDefined();
    expect(result.y).toBeDefined();
  });

  test("target position is on board", () => {
    let result = ai.chooseTarget(board);
    expect(result.x).toBeLessThan(board.width);
    expect(result.x).toBeGreaterThanOrEqual(0);
    expect(result.y).toBeLessThan(board.height);
    expect(result.y).toBeGreaterThanOrEqual(0);
  });

  test("target position was not previously hit", () => {
    let smallBoard = new GameBoard(2, 2);
    let hitPositions = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ];
    let unhitPosition = { x: 1, y: 1 };
    smallBoard.placeShip(unhitPosition, 1, false);

    hitPositions.forEach((pos) => smallBoard.receiveAttack(pos));

    //since its random, just try it a bunch of times
    // and hope it will fail if broken
    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
      let result = ai.chooseTarget(smallBoard);
      expect(result).toEqual(unhitPosition);
    }
  });

  test("sunk boards throw to prevent infinite looping", () => {
    let smallBoard = new GameBoard(2, 2);
    let hitPositions = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];
    smallBoard.placeShip({ x: 0, y: 0 }, 1, false);
    hitPositions.forEach((pos) => smallBoard.receiveAttack(pos));
    expect(() => ai.chooseTarget(smallBoard)).toThrow();
  });
});
