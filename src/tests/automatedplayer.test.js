import AutomatedPlayer from "../automatedplayer";
import DumbAI from "../dumbai";
import GameState from "../gamestate";
import { createDefaultGameState } from "../gamestatefactory";

let attackSpy = jest.spyOn(GameState.prototype, "attack");
let endTurnSpy = jest.spyOn(GameState.prototype, "endTurn");

describe("automated player", () => {
  let autoPlayer;
  let gameState;

  beforeEach(() => {
    autoPlayer = new AutomatedPlayer(new DumbAI());
    gameState = createDefaultGameState();
    gameState.start();
  });

  test("api", () => {
    expect(autoPlayer.playTurn).toBeDefined();
  });

  test("calls attack on gamestate", () => {
    autoPlayer.playTurn(gameState);
    expect(attackSpy).toHaveBeenCalled();
  });

  test("calls endTurn on gamestate", () => {
    autoPlayer.playTurn(gameState);
    expect(endTurnSpy).toHaveBeenCalled();
  });
});
