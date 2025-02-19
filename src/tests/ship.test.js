import Ship from "../ship.js";

describe("ship", () => {
  test("api exists", () => {
    expect(Ship).toBeDefined();
    expect(Ship.prototype.hit).toBeDefined();
    expect(Ship.prototype.isSunk).toBeDefined();
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

  test("ship throws when hit while sunk", () => {
    let someShip = new Ship(1);
    someShip.hit();
    expect(() => someShip.hit()).toThrow();
  });
});
