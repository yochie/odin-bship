import { createDefaultGameState } from "../gamestatefactory";
import TurnTracker from "../turntracker";
import AutomatedPlayer from "../automatedplayer";

const swapSpy = jest.spyOn(TurnTracker.prototype, "swapTurn");
const aiSpy = jest.spyOn(AutomatedPlayer.prototype, "playTurn");

describe("game state", () => {
  let gameState;
  let zero = { x: 0, y: 0 };

  beforeEach(() => {
    gameState = createDefaultGameState();
  });

  //todo: add active/inactive player tests
  test("api", () => {
    expect(gameState.start).toBeDefined();
    expect(gameState.isGameStarted).toBeDefined();
    expect(gameState.attack).toBeDefined();
    expect(gameState.turnTracker).toBeDefined();
    expect(gameState.playerManager).toBeDefined();
    expect(gameState.endTurn).toBeDefined();
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

  test("end turn fails if before game start", () => {
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
    gameState.endTurn();

    expect(aiSpy).toHaveBeenCalled();
  });

  //todo: add test for attacking same position twice
  //using mock or complex state setup... prob mock is better
  // test("attack fails on already attacked tile", () => {
  //   gameState.start();
  //   gameState.attack({ x: 0, y: 0 });

  // });
});
