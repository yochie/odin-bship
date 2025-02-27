import Player from "../player.js";
import Gameboard from "../gameboard.js";

describe("player", () => {
  let player;
  beforeEach(() => {
    const gameboard = new Gameboard(10, 10);
    player = new Player(gameboard);
  });

  test("api", () => {
    expect(player.gameboard).toBeDefined();
    expect(player.isBot).toBeDefined();
  });
});
