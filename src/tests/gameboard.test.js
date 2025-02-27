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
    expect(gb.width).toBeDefined();
    expect(gb.height).toBeDefined();
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

  test("aborted ship placement clears board state", () => {
    expect(() => gb.placeShip({ x: 0, y: 0 }, 11, true)).toThrow("bounds");
    expect(gb.boardHasShip[0][0]).toBeFalsy();
  });

  test("placing overlapping ships throws", () => {
    gb.placeShip({ x: 0, y: 0 }, 2, false);
    expect(() => gb.placeShip({ x: 0, y: 0 }, 2, true)).toThrow("overlap");
  });

  test("unattacked positions have null boardhit state", () => {
    expect(gb.boardHits[0][0]).toBeNull();
  });

  test("missed attacks are recorded", () => {
    gb.receiveAttack({ x: 0, y: 0 });
    expect(gb.boardHits[0][0]).toBe("miss");
  });

  //note we do not test that ship is actually hit
  //I consider this is an internal side effect
  //this will be tested indirectly when ensuring all ships are sunk
  test("landing attacks are recorded", () => {
    gb.placeShip({ x: 0, y: 0 }, 2, false);
    gb.receiveAttack({ x: 0, y: 0 });
    expect(gb.boardHits[0][0]).toBe("hit");
  });

  test("cannot attack same position twice", () => {
    const position = { x: 0, y: 0 };
    gb.receiveAttack(position);
    expect(() => gb.receiveAttack(position)).toThrow("same");
  });

  test("attacking can sink single ship", () => {
    gb.placeShip({ x: 0, y: 0 }, 2, false);
    gb.receiveAttack({ x: 0, y: 0 });
    gb.receiveAttack({ x: 1, y: 0 });
    expect(gb.isFullySunk()).toBeTruthy();
  });

  test("attacking can sink multiple ships", () => {
    gb.placeShip({ x: 0, y: 0 }, 2, false);
    gb.receiveAttack({ x: 0, y: 0 });
    gb.receiveAttack({ x: 1, y: 0 });
    gb.placeShip({ x: 0, y: 1 }, 2, false);
    gb.receiveAttack({ x: 0, y: 1 });
    gb.receiveAttack({ x: 1, y: 1 });
    expect(gb.isFullySunk()).toBeTruthy();
  });

  test("sinking single single ship is not fully sunk", () => {
    gb.placeShip({ x: 0, y: 0 }, 2, false);
    gb.placeShip({ x: 0, y: 1 }, 2, false);
    gb.receiveAttack({ x: 0, y: 0 });
    gb.receiveAttack({ x: 1, y: 0 });
    expect(gb.isFullySunk()).toBeFalsy();
  });

  test("aborted ship placements dont count for board sunk status", () => {
    expect(() => gb.placeShip({ x: 0, y: 0 }, 11, false)).toThrow("bound");
    gb.placeShip({ x: 0, y: 0 }, 2, false);
    gb.receiveAttack({ x: 0, y: 0 });
    gb.receiveAttack({ x: 1, y: 0 });
    expect(gb.isFullySunk()).toBeTruthy();
  });
});
