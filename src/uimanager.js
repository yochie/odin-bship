import BoardView from "./boardview.js";

export default class UIManager {
  playerBoardView;
  opponentBoardView;
  startButton;

  #attackHandlers;
  #startHandlers;

  constructor(playerBoardView, opponentBoardView, startButton) {
    this.playerBoardView = playerBoardView;
    this.opponentBoardView = opponentBoardView;
    this.startButton = startButton;
    this.#attackHandlers = [];
    this.#startHandlers = [];

    this.opponentBoardView.container.addEventListener("click", (event) => {
      this.onAttack(event);
    });

    this.startButton.addEventListener("click", (event) =>
      this.onStartGame(event),
    );
  }

  addAttackHandler(callback) {
    this.#attackHandlers.push(callback);
  }

  addStartHandler(callback) {
    this.#startHandlers.push(callback);
  }

  onAttack(event) {
    if (!event.target.classList.contains("board-cell")) {
      return;
    }
    for (const handler of this.#attackHandlers) {
      handler(event);
    }
  }

  onStartGame(event) {
    for (const handler of this.#startHandlers) {
      handler(event);
    }
  }

  update(gameState) {
    const turnTracker = gameState.turnTracker;
    const players = gameState.playerManager;

    let activePlayerIndex = turnTracker.activePlayer();
    let activePlayerBoard = players.getPlayer(activePlayerIndex).gameBoard;
    this.playerBoardView.render(activePlayerBoard);

    let inactivePlayerIndex = turnTracker.inactivePlayer();
    let inactivePlayerBoard = players.getPlayer(inactivePlayerIndex).gameBoard;
    this.opponentBoardView.render(inactivePlayerBoard);
  }
}
