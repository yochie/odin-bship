import Gameboard from "../gameboard.js";

describe("Gameboard", () => {
  test("api exists", () => {
    expect(Gameboard).toBeDefined();
    expect(Gameboard.prototype.placeShip).toBeDefined();
    expect(Gameboard.prototype.receiveAttack).toBeDefined();
    expect(Gameboard.prototype.isFullySunk).toBeDefined();
  });
});
