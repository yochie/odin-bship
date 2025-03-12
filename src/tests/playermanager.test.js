import PlayerManager from "../playermanager";
import Player from "../player";
import { GameBoard } from "../gameboard";

const playerDeadMock = jest.spyOn(Player.prototype, "isDead");

describe("Player manager", () => {
  let playerManager;
  const boardWidth = 10;
  const boardHeight = 10;

  beforeEach(() => {
    playerManager = new PlayerManager();
    playerDeadMock.mockClear();
  });

  test("api", () => {
    expect(playerManager.addPlayer).toBeDefined();
    expect(playerManager.getPlayer).toBeDefined();
    expect(playerManager.isGameOver).toBeDefined();
    expect(playerManager.isVersusBot).toBeDefined();
    expect(playerManager.getIndex).toBeDefined();
    expect(playerManager.isPlacementDone).toBeDefined();
  });

  test("empty initially", () => {
    expect(() => playerManager.getPlayer(0)).toThrow();
  });

  test("added players are retrievable", () => {
    let p1 = new Player(new GameBoard(boardWidth, boardHeight), false);
    playerManager.addPlayer(p1);
    expect(playerManager.getPlayer(0)).toBe(p1);
  });

  test("negative index throws", () => {
    expect(() => playerManager.getPlayer(-1)).toThrow();
  });

  test("out of bounds index throws", () => {
    expect(() => playerManager.getPlayer(99)).toThrow();
  });

  test("not game over when all players are not dead", () => {
    playerDeadMock.mockImplementation(() => {
      return false;
    });
    let player1 = new Player(new GameBoard(boardWidth, boardHeight), false);
    let player2 = new Player(new GameBoard(boardWidth, boardHeight), false);
    playerManager.addPlayer(player1);
    playerManager.addPlayer(player2);
    expect(playerManager.isGameOver()).toBeFalsy();
  });

  test("game over when any player is dead", () => {
    //alternative to mocking here would be to create players with actual boards
    //to avoid coupling to those implementations I would rather use mock of player
    playerDeadMock.mockImplementation(() => {
      return true;
    });
    let player1 = new Player(new GameBoard(boardWidth, boardHeight), false);
    let player2 = new Player(new GameBoard(boardWidth, boardHeight), false);
    playerManager.addPlayer(player1);
    playerManager.addPlayer(player2);
    expect(playerManager.isGameOver()).toBeTruthy();
  });

  test("throws if no players", () => {
    expect(() => playerManager.isVersusBot()).toThrow();
  });

  test("correctly detects bot player", () => {
    let player1 = new Player(new GameBoard(boardWidth, boardHeight), false);
    let player2 = new Player(new GameBoard(boardWidth, boardHeight), true);

    playerManager.addPlayer(player1);
    playerManager.addPlayer(player2);
    expect(playerManager.isVersusBot()).toBeTruthy();
  });

  test("correctly detects no bot player", () => {
    let player1 = new Player(new GameBoard(boardWidth, boardHeight), false);
    let player2 = new Player(new GameBoard(boardWidth, boardHeight), false);
    playerManager.addPlayer(player1);
    playerManager.addPlayer(player2);
    expect(playerManager.isVersusBot()).toBeFalsy();
  });

  test("getIndex returns -1 if not found", () => {
    expect(playerManager.getIndex(null)).toEqual(-1);
  });

  test("returns correct index", () => {
    let player1 = new Player(new GameBoard(boardWidth, boardHeight), false);
    let player2 = new Player(new GameBoard(boardWidth, boardHeight), false);
    playerManager.addPlayer(player1);
    playerManager.addPlayer(player2);
    expect(playerManager.getIndex(player2)).toEqual(1);
  });

  test("placement not done if not done for all", () => {
    let player1 = new Player(
      new GameBoard(boardWidth, boardHeight),
      false,
      false,
    );
    let player2 = new Player(
      new GameBoard(boardWidth, boardHeight),
      false,
      true,
    );
    playerManager.addPlayer(player1);
    playerManager.addPlayer(player2);
    expect(playerManager.isPlacementDone()).toBeFalsy();
  });

  test("placement done if done for all", () => {
    let player1 = new Player(
      new GameBoard(boardWidth, boardHeight),
      false,
      true,
    );
    let player2 = new Player(
      new GameBoard(boardWidth, boardHeight),
      false,
      true,
    );
    playerManager.addPlayer(player1);
    playerManager.addPlayer(player2);
    expect(playerManager.isPlacementDone()).toBeTruthy();
  });

  test("placement not done if no players", () => {
    expect(playerManager.isPlacementDone()).toBeFalsy();
  });
});
