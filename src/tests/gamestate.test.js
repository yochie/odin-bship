import { createDefaultGameState } from "./mother";

describe("game state", () => {
  let gameState;

  beforeEach(() => {
    gameState = createDefaultGameState();
  });

  test("api", () => {
    expect(gameState.start).toBeDefined();
    expect(gameState.isGameStarted).toBeDefined();
    expect(gameState.attack).toBeDefined();
    expect(gameState.turnTracker).toBeDefined();
    expect(gameState.playerManager).toBeDefined();
  });

  test("not started by default", () => {
    expect(gameState.isGameStarted()).toBeFalsy();
  });

  test("started by start call", () => {
    gameState.start();
    expect(gameState.isGameStarted()).toBeTruthy();
  });

  test("attack throws with bad args", () => {
    expect(() => gameState.attack()).toThrow("args");
    expect(() => gameState.attack({ x: "a", y: "b" })).toThrow("args");
    expect(() => gameState.attack({ x: 1.5, y: 1 })).toThrow("args");
    expect(() => gameState.attack({ x: 1.5 })).toThrow("args");
  });

  test("attack fails if game not started", () => {
    expect(gameState.attack({ x: 0, y: 0 })).toBeFalsy();
  });

  test("attack fails if already done for turn", () => {
    gameState.start();
    gameState.attack({ x: 0, y: 0 });
    expect(gameState.attack({ x: 0, y: 0 })).toBeFalsy();
  });

  //todo: add test for attacking same position twice
  //using mock or complex state setup... prob mock is better
});
