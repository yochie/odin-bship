import TurnTracker from "../turntracker";

describe("game state", () => {
  let tracker;
  let playerManager;
  const boardWidth = 10;
  const boardHeight = 10;

  beforeEach(() => {
    tracker = new TurnTracker();
  });

  test("api", () => {
    expect(tracker.activePlayer).toBeDefined();
    expect(tracker.inactivePlayer).toBeDefined();
    expect(tracker.attack).toBeDefined();
    expect(tracker.startGame).toBeDefined();
    expect(tracker.isAttackDone).toBeDefined();
    expect(tracker.isTurnStarted).toBeDefined();
    expect(tracker.startTurn).toBeDefined();
  });

  test("game not started by default", () => {
    expect(tracker.isGameStarted()).toBeFalsy();
  });

  test("game startable", () => {
    tracker.startGame();
    expect(tracker.isGameStarted()).toBeTruthy();
  });

  test("no inactive/active player (negative index) before game start", () => {
    expect(tracker.activePlayer()).toBeLessThan(0);
    expect(tracker.inactivePlayer()).toBeLessThan(0);
  });

  test("attacks on unstarted game throw", () => {
    expect(() => tracker.attack()).toThrow();
  });

  test("attacks on unstarted turn throw", () => {
    tracker.startGame();
    expect(() => tracker.attack()).toThrow();
  });

  test("attacks once per turn max", () => {
    tracker.startGame();
    tracker.startTurn();
    tracker.attack();
    expect(() => tracker.attack()).toThrow();
  });

  test("attacks for turn are recorded", () => {
    tracker.startGame();
    tracker.startTurn();
    tracker.attack();
    expect(tracker.isAttackDone()).toBeTruthy();
  });

  test("turn swap throws if game is not started", () => {
    expect(() => this.swapTurn()).toThrow();
  });

  test("turn swap changes active players", () => {
    tracker.startGame();
    const firstPlayer = tracker.activePlayer();
    const secondPlayer = tracker.inactivePlayer();
    tracker.swapTurn();
    expect(tracker.inactivePlayer()).toBe(firstPlayer);
    expect(tracker.activePlayer()).toBe(secondPlayer);
  });

  test("attack and turn state refreshed on turn swap", () => {
    tracker.startGame();
    tracker.startTurn();
    tracker.attack();
    tracker.swapTurn();
    expect(tracker.isAttackDone()).toBeFalsy();
    expect(tracker.isTurnStarted()).toBeFalsy();
  });

  test("turn not started by default", () => {
    expect(tracker.isTurnStarted()).toBeFalsy();
  });

  test("starting turn before game throws", () => {
    expect(() => tracker.startTurn()).toThrow();
  });

  test("turn correctly started", () => {
    tracker.startGame();
    tracker.startTurn();
    expect(tracker.isTurnStarted()).toBeTruthy();
  });

  test("turn started reset between turns", () => {
    tracker.startGame();
    tracker.startTurn();
    tracker.attack();
    tracker.swapTurn();
    expect(tracker.isTurnStarted()).toBeFalsy();
  });
});
