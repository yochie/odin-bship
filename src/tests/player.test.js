import Player from "../player.js";
import { GameBoard } from "../gameboard.js";

describe("player", () => {
  let player;
  const zero = { x: 0, y: 0 };

  beforeEach(() => {
    player = new Player(new GameBoard(10, 10), false, false);
  });

  test("api", () => {
    expect(player.gameBoard).toBeDefined();
    expect(player.isBot).toBeDefined();
    expect(player.isDead).toBeDefined();
    expect(player.isBoardPlaced).toBeDefined();
    expect(player.setBoardPlaced).toBeDefined();
  });

  test("player dead with empty board", () => {
    expect(player.isDead()).toBeTruthy();
  });

  test("player not dead with a ship", () => {
    player.gameBoard.placeShip(zero, 1, true);
    expect(player.isDead()).toBeFalsy();
  });

  test("setBoardPlaced changes state", () => {
    player.gameBoard.placeShip(zero, 1, true);
    player.setBoardPlaced();
    expect(player.isBoardPlaced()).toBeTruthy();
  });

  test("setBoardPlaced throws if already sunk", () => {
    expect(() => player.setBoardPlaced()).toThrow();
  });
});
