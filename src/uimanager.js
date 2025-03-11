import BoardView from "./boardview.js";
//screen keys
const BOARDS = "boards";
const START = "start";
const OVER = "over";
const SWAP = "swap";

export default class UIManager {
  //board views
  #playerBoardView;
  #opponentBoardView;
  #gameOverBoardViews;

  //buttons
  #startButton;
  #endTurnButton;
  #resetButton;
  #startTurnButton;

  //dom nodes
  #gameOverNode;
  #gameStartNode;
  #gameBoardNode;
  #instructionNode;
  #turnSwapNode;

  #attackHandlers;
  #startHandlers;
  #endTurnHandlers;
  #resetHandlers;
  #startTurnHandlers;

  constructor(
    playerBoardView,
    opponentBoardView,
    startButton,
    startTurnButton,
    endTurnButton,
    resetButton,
    gameOverNode,
    gameStartNode,
    turnSwapNode,
    gameBoardNode,
    instructionNode,
    gameOverBoardViews,
  ) {
    //dom buttons
    this.#startButton = startButton;
    this.#endTurnButton = endTurnButton;
    this.#resetButton = resetButton;
    this.#startTurnButton = startTurnButton;

    //dom containers
    this.#gameOverNode = gameOverNode;
    this.#gameStartNode = gameStartNode;
    this.#gameBoardNode = gameBoardNode;
    this.#instructionNode = instructionNode;
    this.#turnSwapNode = turnSwapNode;

    //dom view/managers
    this.#playerBoardView = playerBoardView;
    this.#opponentBoardView = opponentBoardView;
    this.#gameOverBoardViews = gameOverBoardViews;

    //handlers lists
    this.#attackHandlers = [];
    this.#startHandlers = [];
    this.#endTurnHandlers = [];
    this.#resetHandlers = [];
    this.#startTurnHandlers = [];

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

    this.#startTurnButton.addEventListener("click", (event) =>
      this.onStartTurn(event),
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

  addResetHandler(callback) {
    this.#resetHandlers.push(callback);
  }

  addStartTurnHandler(callback) {
    this.#startTurnHandlers.push(callback);
  }

  onAttack(event) {
    let gameState = null;
    //ensure this is actually an attack event
    if (!event.target.classList.contains("board-cell")) {
      return;
    }
    for (const handler of this.#attackHandlers) {
      gameState = handler(event);
    }
    this.update(gameState);
  }

  onStartGame(event) {
    let gameState;
    for (const handler of this.#startHandlers) {
      gameState = handler(event);
    }
    this.update(gameState);
  }

  onEndTurn(event) {
    let gameState = null;
    for (const handler of this.#endTurnHandlers) {
      gameState = handler(event);
    }
    this.update(gameState);
  }

  onStartTurn(event) {
    let gameState = null;
    for (const handler of this.#startTurnHandlers) {
      gameState = handler(event);
    }
    this.update(gameState);
  }

  onReset(event) {
    let gameState = null;
    for (const handler of this.#resetHandlers) {
      gameState = handler(event);
    }
    this.update(gameState);
  }

  update(gameState) {
    if (gameState === null) {
      return;
    }
    const turnTracker = gameState.turnTracker;
    const players = gameState.playerManager;

    if (!turnTracker.isGameStarted()) {
      this.displayScreen(START);
      return;
    }

    if (!turnTracker.isTurnStarted()) {
      this.displayScreen(SWAP);
      return;
    }

    if (players.isGameOver()) {
      this.fillGameOverScreen(gameState);
      this.displayScreen(OVER);
      return;
    }

    let activePlayerBoard = gameState.activePlayer().gameBoard;
    this.#playerBoardView.render(activePlayerBoard);

    let inactivePlayerBoard = gameState.inactivePlayer().gameBoard;
    this.#opponentBoardView.render(inactivePlayerBoard);

    this.instructionDisplay(
      turnTracker.isAttackDone(),
      inactivePlayerBoard.lastAttackLanded(),
    );

    this.displayScreen(BOARDS);
  }

  fillGameOverScreen(gameState) {
    const players = gameState.playerManager;
    const playerCount = 2;
    for (let i = 0; i < playerCount; i++) {
      this.#gameOverBoardViews[i].render(players.getPlayer(i).gameBoard);
    }
  }

  gameOverDisplay(show) {
    if (show) {
      this.#gameOverNode.classList.add("active");
    } else {
      this.#gameOverNode.classList.remove("active");
    }
  }

  gameStartDisplay(show) {
    if (show) {
      this.#gameStartNode.classList.add("active");
    } else {
      this.#gameStartNode.classList.remove("active");
    }
  }

  gameBoardDisplay(show) {
    if (show) {
      this.#gameBoardNode.classList.add("active");
    } else {
      this.#gameBoardNode.classList.remove("active");
      this.instructionDisplay(false);
    }
  }

  turnSwapDisplay(show) {
    if (show) {
      this.#turnSwapNode.classList.add("active");
    } else {
      this.#turnSwapNode.classList.remove("active");
    }
  }

  //todo : implement as dict that is enabled/disabled by key with iteration
  displayScreen(screen) {
    switch (screen) {
      case START:
        this.gameStartDisplay(true);
        this.gameBoardDisplay(false);
        this.turnSwapDisplay(false);
        this.gameOverDisplay(false);
        break;
      case BOARDS:
        this.gameStartDisplay(false);
        this.gameBoardDisplay(true);
        this.turnSwapDisplay(false);
        this.gameOverDisplay(false);
        break;
      case SWAP:
        this.gameStartDisplay(false);
        this.gameBoardDisplay(false);
        this.turnSwapDisplay(true);
        this.gameOverDisplay(false);
        break;
      case OVER:
        this.gameStartDisplay(false);
        this.gameBoardDisplay(false);
        this.turnSwapDisplay(false);
        this.gameOverDisplay(true);
        break;
    }
  }

  instructionDisplay(attackDone, attackLanded = false) {
    if (!attackDone) {
      this.#instructionNode.textContent = "Choose target...";
      this.#endTurnButton.style.visibility = "hidden";
      return;
    }

    this.#endTurnButton.style.visibility = "visible";
    this.#instructionNode.textContent = attackLanded
      ? "Its a hit!"
      : "Attack missed.";
  }
}
