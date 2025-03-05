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
  });

  test("game not started yet", () => {
    expect(tracker.gameStarted).toBeFalsy();
  });

  test("game not over yet", () => {
    expect(tracker.gameOver).toBeFalsy();
  });

  test("has activePlayer", () => {
    expect(tracker.activePlayer()).toBeDefined();
  });

  test("has inactivePlayer", () => {
    expect(tracker.inactivePlayer()).toBeDefined();
  });

  test("attacks on unstarted game throw", () => {
    expect(() => tracker.attack()).toThrow();
  });

  test("started game is properly set", () => {
    tracker.startGame();
    expect(tracker.isGameStarted()).toBeTruthy();
  });

  test("attacks once per turn max", () => {
    const p1Board = tracker.activePlayer.gameBoard;

    tracker.startGame();
    tracker.attack();
    expect(() => tracker.attack()).toThrow();
  });

  test("attacks for turn are recorded", () => {
    tracker.startGame();
    tracker.attack();
    expect(tracker.isAttackDone()).toBeTruthy();
  });

  test("turn swap changes active players", () => {
    tracker.startGame();
    const firstPlayer = tracker.activePlayer();
    const secondPlayer = tracker.inactivePlayer();
    tracker.swapTurn();
    expect(tracker.inactivePlayer()).toBe(firstPlayer);
    expect(tracker.activePlayer()).toBe(secondPlayer);
  });

  test("attack done state refreshed on turn swap", () => {
    tracker.startGame();
    tracker.attack();
    tracker.swapTurn();
    expect(tracker.isAttackDone()).toBeFalsy();
  });

  // test("attacks can cause gameover", () => {

  //   gameState.startGame();
  //   gameState.attack();
  // });
});
