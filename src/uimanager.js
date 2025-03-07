import BoardView from "./boardview.js";

export default class UIManager {
  #playerBoardView;
  #opponentBoardView;
  #startButton;
  #endTurnButton;
  #gameOverNode;
  #gameStartNode;
  #resetButton;

  #attackHandlers;
  #startHandlers;
  #endTurnHandlers;
  #resetHandlers;

  constructor(
    playerBoardView,
    opponentBoardView,
    startButton,
    endTurnButton,
    gameOverNode,
    resetButton,
    gameStartNode,
  ) {
    //dom buttons
    this.#startButton = startButton;
    this.#endTurnButton = endTurnButton;
    this.#resetButton = resetButton;

    //dom containers
    this.#gameOverNode = gameOverNode;
    this.#gameStartNode = gameStartNode;

    //dom view/managers
    this.#playerBoardView = playerBoardView;
    this.#opponentBoardView = opponentBoardView;

    //handlers lists
    this.#attackHandlers = [];
    this.#startHandlers = [];
    this.#endTurnHandlers = [];
    this.#resetHandlers = [];

    this.#opponentBoardView.container.addEventListener("click", (event) => {
      this.onAttack(event);
    });

    this.#startButton.addEventListener("click", (event) =>
      this.onStartGame(event),
    );

    this.#endTurnButton.addEventListener("click", (event) =>
      this.onEndTurn(event),
    );

    this.#resetButton.addEventListener("click", (event) => this.onReset(event));
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

  addResetHandler(callback) {
    this.#resetHandlers.push(callback);
  }

  onAttack(event) {
    //ensure this is actually an attack event
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
    this.gameStartDisplay(false);
  }

  onEndTurn(event) {
    for (const handler of this.#endTurnHandlers) {
      handler(event);
    }
  }

  onReset(event) {
    this.gameStartDisplay(true);
    this.gameOverDisplay(false);
    for (const handler of this.#resetHandlers) {
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

  gameStartDisplay(show) {
    this.#gameStartNode.style.visibility = show ? "visible" : "hidden";
  }
}
