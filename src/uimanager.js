import BoardView from "./boardview.js";

export default class UIManager {
  #playerBoardView;
  #opponentBoardView;
  #startButton;
  #endTurnButton;

  #attackHandlers;
  #startHandlers;
  #endTurnHandlers;
  #gameOverNode;

  constructor(
    playerBoardView,
    opponentBoardView,
    startButton,
    endTurnButton,
    gameOverNode,
  ) {
    this.#playerBoardView = playerBoardView;
    this.#opponentBoardView = opponentBoardView;
    this.#startButton = startButton;
    this.#endTurnButton = endTurnButton;
    this.#gameOverNode = gameOverNode;
    this.#attackHandlers = [];
    this.#startHandlers = [];
    this.#endTurnHandlers = [];

    this.#opponentBoardView.container.addEventListener("click", (event) => {
      this.onAttack(event);
    });

    this.#startButton.addEventListener("click", (event) =>
      this.onStartGame(event),
    );

    this.#endTurnButton.addEventListener("click", (event) =>
      this.onEndTurn(event),
    );
  }

  addAttackHandler(callback) {
    this.#attackHandlers.push(callback);
  }

  addStartHandler(callback) {
    this.#startHandlers.push(callback);
  }

  addEndTurnHandler(callback) {
    this.#endTurnHandlers.push(callback);
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
    this.gameOverDisplay(false);
    for (const handler of this.#startHandlers) {
      handler(event);
    }
  }

  onEndTurn(event) {
    for (const handler of this.#endTurnHandlers) {
      handler(event);
    }
  }

  update(gameState) {
    const turnTracker = gameState.turnTracker;
    const players = gameState.playerManager;

    let activePlayerIndex = turnTracker.activePlayer();
    let activePlayerBoard = players.getPlayer(activePlayerIndex).gameBoard;
    this.#playerBoardView.render(activePlayerBoard);

    let inactivePlayerIndex = turnTracker.inactivePlayer();
    let inactivePlayerBoard = players.getPlayer(inactivePlayerIndex).gameBoard;
    this.#opponentBoardView.render(inactivePlayerBoard);

    if (players.isGameOver()) {
      this.gameOverDisplay(true);
    }
  }

  gameOverDisplay(over) {
    this.#gameOverNode.style.display = over ? "block" : "none";
  }
}
