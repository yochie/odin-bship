import Player from "../player.js";
import GameBoard from "../gameboard.js";

describe("player", () => {
  let player;

  beforeEach(() => {
    player = new Player(new GameBoard(10, 10), false);
  });

  test("api", () => {
    expect(player.gameBoard).toBeDefined();
    expect(player.isBot).toBeDefined();
    expect(player.isDead).toBeDefined();
  });
});
