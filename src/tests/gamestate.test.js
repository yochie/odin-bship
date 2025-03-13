import {
  createTestGameStatePVB,
  createTestGameStatePVP,
} from "../gamestatefactory";
import TurnTracker from "../turntracker";
import AutomatedPlayer from "../automatedplayer";
import Player from "../player";

const swapSpy = jest.spyOn(TurnTracker.prototype, "swapTurn");
const startTurnSpy = jest.spyOn(TurnTracker.prototype, "startTurn");
const aiSpy = jest.spyOn(AutomatedPlayer.prototype, "playTurn");

describe("game state", () => {
  let gameState;
  let zero = { x: 0, y: 0 };

  beforeEach(() => {
    gameState = createTestGameStatePVB();
    swapSpy.mockClear();
    startTurnSpy.mockClear();
    aiSpy.mockClear();
  });

  test("api", () => {
    expect(gameState.start).toBeDefined();
    expect(gameState.isGameStarted).toBeDefined();
    expect(gameState.attack).toBeDefined();
    expect(gameState.turnTracker).toBeDefined();
    expect(gameState.playerManager).toBeDefined();
    expect(gameState.endTurn).toBeDefined();
    expect(gameState.startTurn).toBeDefined();
    expect(gameState.activePlayer).toBeDefined();
    expect(gameState.inactivePlayer).toBeDefined();
  });

  test("not started by default", () => {
    expect(gameState.isGameStarted()).toBeFalsy();
  });

  test("started by start call", () => {
    gameState.start();
    expect(gameState.isGameStarted()).toBeTruthy();
  });

  test("cant start turn before game", () => {
    //need to use humans only as bots will auto start turns
    gameState = createTestGameStatePVP();
    expect(() => gameState.startTurn()).toThrow();
  });

  test("attack throws with bad args", () => {
    gameState.start();
    expect(() => gameState.attack()).toThrow("args");
    expect(() => gameState.attack({ x: "a", y: "b" })).toThrow("args");
    expect(() => gameState.attack({ x: 1.5, y: 1 })).toThrow("args");
    expect(() => gameState.attack({ x: 1.5 })).toThrow("args");
  });

  test("attack fails if game not started", () => {
    //need to use humans only as bots will auto start turns
    gameState = createTestGameStatePVP();
    expect(gameState.attack({ x: 0, y: 0 })).toBeFalsy();
  });

  test("attack fails if turn not started", () => {
    //need to use humans only as bots will auto start turns
    gameState = createTestGameStatePVP();
    gameState.start();
    expect(gameState.attack({ x: 0, y: 0 })).toBeFalsy();
  });

  test("attack fails if already done for turn", () => {
    gameState.start();
    gameState.attack({ x: 0, y: 0 });
    expect(gameState.attack({ x: 0, y: 0 })).toBeFalsy();
  });

  test("end turn fails if before game start", () => {
    expect(gameState.endTurn()).toBeFalsy();
  });

  test("end turn fails if before turn start", () => {
    //need to use humans only as bots will auto start turns
    gameState = createTestGameStatePVP();
    gameState.start();
    expect(gameState.endTurn()).toBeFalsy();
  });

  test("end turn fails if before attack", () => {
    gameState.start();
    expect(gameState.endTurn()).toBeFalsy();
  });

  test("end turn fails if game over", () => {
    gameState.start();
    //should end game as its only ship by default
    gameState.attack({ x: 0, y: 0 });

    expect(gameState.endTurn()).toBeFalsy();
  });

  test("end turn succeeds under normal conditions", () => {
    gameState.start();
    //could be redundant if bot goes first but should not matter
    gameState.startTurn();
    gameState.attack({ x: 1, y: 0 });
    let result = gameState.endTurn();
    expect(result).toBeTruthy();
  });

  //we only check behaviour here
  //state is more complex should be validated elsewhere
  test("end turn calls turn swap on turnTracker", () => {
    gameState.start();
    gameState.attack({ x: 1, y: 0 });
    gameState.endTurn();

    expect(swapSpy).toHaveBeenCalled();
  });

  test("end turn calls ai for bot players", () => {
    gameState.start();
    gameState.attack({ x: 1, y: 0 });
    //second player is bot in default state
    gameState.endTurn();

    expect(aiSpy).toHaveBeenCalled();
  });

  test("game start will auto start turn if vs bot", () => {
    gameState.start();
    expect(startTurnSpy).toHaveBeenCalled();
  });

  test("turn end will auto start turn for both players if vs bot", () => {
    gameState.start();
    gameState.attack({ x: 1, y: 0 });
    gameState.endTurn();
    //once for game start, once for bot, then once for human
    expect(startTurnSpy).toHaveBeenCalledTimes(3);
  });

  test("active returned after game start", () => {
    gameState.start();
    expect(gameState.activePlayer()).toBeInstanceOf(Player);
  });

  test("inactive returned after game start", () => {
    gameState.start();
    expect(gameState.inactivePlayer()).toBeInstanceOf(Player);
  });

  test("attack fails on already attacked tile", () => {
    gameState.start();
    gameState.attack({ x: 1, y: 0 });
    gameState.endTurn();
    //since bot, will return to same player
    let result = gameState.attack({ x: 1, y: 0 });
    expect(result).toBeFalsy();
  });
});
