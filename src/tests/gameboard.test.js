import Gameboard from "../gameboard.js";

describe("Gameboard", () => {
  let gb;
  let zero = { x: 0, y: 0 };

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
    expect(gb.hitAt).toBeDefined();
    expect(gb.hasShipAt).toBeDefined();
    expect(gb.lastAttackLanded).toBeDefined();
    expect(gb.lastHitPosition).toBeDefined();
  });

  test("empty slots are indeed empty", () => {
    expect(gb.hasShipAt(zero)).toBeFalsy();
  });

  test("placement happy path", () => {
    gb.placeShip(zero, 3, true);
    expect(gb.hasShipAt(zero)).toBeTruthy();
    expect(gb.hasShipAt({ x: 0, y: 1 })).toBeTruthy();
    expect(gb.hasShipAt({ x: 0, y: 2 })).toBeTruthy();
  });

  test("placement outside bounds throws", () => {
    expect(() => gb.placeShip({ x: 11, y: 0 }, 1, true)).toThrow("bounds");
  });

  test("placing ship that wont fit throws", () => {
    expect(() => gb.placeShip(zero, 11, true)).toThrow("bounds");
  });

  test("aborted ship placement clears board state", () => {
    expect(() => gb.placeShip(zero, 11, true)).toThrow("bounds");
    expect(gb.hasShipAt(zero)).toBeFalsy();
  });

  test("placing overlapping ships throws", () => {
    gb.placeShip(zero, 2, false);
    expect(() => gb.placeShip(zero, 2, true)).toThrow("overlap");
  });

  test("unattacked positions have null boardhit state", () => {
    expect(gb.hitAt(zero)).toBeNull();
  });

  test("missed attacks are recorded", () => {
    gb.receiveAttack(zero);
    expect(gb.hitAt(zero)).toBe("miss");
  });

  //note we do not test that ship is actually hit
  //I consider this is an internal side effect
  //this will be tested indirectly when ensuring all ships are sunk
  test("landing attacks are recorded", () => {
    gb.placeShip(zero, 2, false);
    gb.receiveAttack(zero);
    expect(gb.hitAt(zero)).toBe("hit");
  });

  test("cannot attack same position twice", () => {
    const position = zero;
    gb.receiveAttack(position);
    expect(() => gb.receiveAttack(position)).toThrow("same");
  });

  test("attacking can sink single ship", () => {
    gb.placeShip(zero, 2, false);
    gb.receiveAttack(zero);
    gb.receiveAttack({ x: 1, y: 0 });
    expect(gb.isFullySunk()).toBeTruthy();
  });

  test("attacking can sink multiple ships", () => {
    gb.placeShip(zero, 2, false);
    gb.receiveAttack(zero);
    gb.receiveAttack({ x: 1, y: 0 });
    gb.placeShip({ x: 0, y: 1 }, 2, false);
    gb.receiveAttack({ x: 0, y: 1 });
    gb.receiveAttack({ x: 1, y: 1 });
    expect(gb.isFullySunk()).toBeTruthy();
  });

  test("sinking single single ship is not fully sunk", () => {
    gb.placeShip(zero, 2, false);
    gb.placeShip({ x: 0, y: 1 }, 2, false);
    gb.receiveAttack(zero);
    gb.receiveAttack({ x: 1, y: 0 });
    expect(gb.isFullySunk()).toBeFalsy();
  });

  test("aborted ship placements dont count for board sunk status", () => {
    expect(() => gb.placeShip(zero, 11, false)).toThrow("bound");
    gb.placeShip(zero, 2, false);
    gb.receiveAttack(zero);
    gb.receiveAttack({ x: 1, y: 0 });
    expect(gb.isFullySunk()).toBeTruthy();
  });

  test("last attack landed correctly recorded on hit", () => {
    gb.placeShip(zero, 2, false);
    gb.receiveAttack(zero);
    expect(gb.lastAttackLanded()).toBeTruthy();
  });

  test("last attack landed correctly recorded on miss", () => {
    gb.placeShip(zero, 2, false);
    gb.receiveAttack({ x: 3, y: 3 });
    expect(gb.lastAttackLanded()).toBeFalsy();
  });

  test("last attack landed false in absence of attacks", () => {
    expect(gb.lastAttackLanded()).toBeFalsy();
  });

  test("last hit position returned", () => {
    const target = { x: 3, y: 3 };
    gb.receiveAttack(target);
    expect(gb.lastHitPosition()).toEqual(target);
  });
});
