import { GameBoard, HIT, MISS } from "../gameboard.js";

describe("Gameboard", () => {
  let gb;
  let zero = { x: 0, y: 0 };

  beforeEach(() => {
    gb = new GameBoard(10, 10);
  });

  test("api exists", () => {
    expect(GameBoard).toBeDefined();
    expect(gb.placeShip).toBeDefined();
    expect(gb.receiveAttack).toBeDefined();
    expect(gb.isFullySunk).toBeDefined();
    expect(gb.width).toBeDefined();
    expect(gb.height).toBeDefined();
    expect(gb.hitAt).toBeDefined();
    expect(gb.hasShipAt).toBeDefined();
    expect(gb.lastAttackLanded).toBeDefined();
    expect(gb.lastHitPosition).toBeDefined();
    expect(gb.lastHitSize).toBeDefined();
    expect(gb.isShipSunkAt).toBeDefined();
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
    expect(gb.placeShip({ x: 11, y: 0 }, 1, true)).toBeFalsy();
  });

  test("placing ship that wont fit returns false", () => {
    expect(gb.placeShip(zero, 11, true)).toBeFalsy();
  });

  test("aborted ship placement clears board state", () => {
    expect(gb.placeShip(zero, 11, true)).toBeFalsy();
    expect(gb.hasShipAt(zero)).toBeFalsy();
  });

  test("placing overlapping ships throws", () => {
    gb.placeShip(zero, 2, false);
    expect(gb.placeShip(zero, 2, true)).toBeFalsy();
  });

  test("unattacked positions have null boardhit state", () => {
    expect(gb.hitAt(zero)).toBeNull();
  });

  test("missed attacks are recorded", () => {
    gb.receiveAttack(zero);
    expect(gb.hitAt(zero)).toBe(MISS);
  });

  //note we do not test that ship is actually hit
  //I consider this is an internal side effect
  //this will be tested indirectly when ensuring all ships are sunk
  test("landing attacks are recorded", () => {
    gb.placeShip(zero, 2, false);
    gb.receiveAttack(zero);
    expect(gb.hitAt(zero)).toBe(HIT);
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
    expect(gb.placeShip(zero, 11, false)).toBeFalsy();
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

  test("last hit ship size correctly returned", () => {
    gb.placeShip(zero, 2, false);
    gb.receiveAttack(zero);
    expect(gb.lastHitSize()).toBe(2);
  });

  test("last hit ship size returns -1 if no ship hit", () => {
    gb.receiveAttack(zero);
    expect(gb.lastHitSize()).toBe(-1);
  });

  test("last hit ship size returns -1 if no hits", () => {
    expect(gb.lastHitSize()).toBe(-1);
  });

  test("ship sunk returns false if no ship", () => {
    expect(gb.isShipSunkAt(zero)).toBeFalsy();
  });

  test("ship sunk returns false if ship not sunk", () => {
    gb.placeShip(zero, 1, false);
    expect(gb.isShipSunkAt(zero)).toBeFalsy();
  });

  test("ship sunk returns true if ship is sunk", () => {
    gb.placeShip(zero, 1, false);
    gb.receiveAttack(zero);
    expect(gb.isShipSunkAt(zero)).toBeTruthy();
  });
});
