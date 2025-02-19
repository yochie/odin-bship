import Ship from "./ship.js";

describe("ship", () => {
  test("exists", () => {
    expect(Ship).toBeDefined();
  });

  test("ship not sunk by default", () => {
    let someShip = new Ship(1);
    expect(someShip.isSunk()).toBeFalsy();
  });

  test("ship sinks", () => {
    let someShip = new Ship(1);
    someShip.hit();
    expect(someShip.isSunk()).toBeTruthy();
  });
});
