import Gameboard from "../gameboard.js";

describe("Gameboard", () => {
  let gb;

  beforeEach(() => {
    gb = new Gameboard(10, 10);
  });

  test("api exists", () => {
    expect(Gameboard).toBeDefined();
    expect(gb.placeShip).toBeDefined();
    expect(gb.receiveAttack).toBeDefined();
    expect(gb.isFullySunk).toBeDefined();
    expect(gb.maxX).toBeDefined();
    expect(gb.maxY).toBeDefined();
    expect(gb.boardHits).toBeDefined();
    expect(gb.boardHasShip).toBeDefined();
  });

  test("empty slots are indeed empty", () => {
    expect(gb.boardHasShip[0][0]).toBeFalsy();
  });

  test("placement happy path", () => {
    gb.placeShip({ x: 0, y: 0 }, 10, true);
    expect(gb.boardHasShip[0][0]).toBeTruthy();
    expect(gb.boardHasShip[0][1]).toBeTruthy();
    expect(gb.boardHasShip[0][2]).toBeTruthy();
  });

  test("placement outside bounds throws", () => {
    expect(() => gb.placeShip({ x: 11, y: 0 }, 1, true)).toThrow("bounds");
  });

  test("placing ship that wont fit throws", () => {
    expect(() => gb.placeShip({ x: 0, y: 0 }, 11, true)).toThrow("bounds");
  });

  test("placing overlapping ships throws", () => {
    gb.placeShip({ x: 0, y: 0 }, 2, false);
    expect(() => gb.placeShip({ x: 0, y: 0 }, 2, true)).toThrow("overlap");
  });
});
