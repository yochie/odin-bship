import BoardView from "./boardview.js";
const BOARDS = "boards";
const START = "start";
const OVER = "over";

export default class UIManager {
  #playerBoardView;
  #opponentBoardView;

  //buttons
  #startButton;
  #endTurnButton;
  #resetButton;

  //containers
  #gameOverNode;
  #gameStartNode;
  #gameBoardNode;
  #instructionNode;
  #gameOverBoardViews;

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
    instructionNode,
    gameBoardNode,
    gameOverBoardViews,
  ) {
    //dom buttons
    this.#startButton = startButton;
    this.#endTurnButton = endTurnButton;
    this.#resetButton = resetButton;

    //dom containers
    this.#gameOverNode = gameOverNode;
    this.#gameStartNode = gameStartNode;
    this.#gameBoardNode = gameBoardNode;
    this.#instructionNode = instructionNode;

    //dom view/managers
    this.#playerBoardView = playerBoardView;
    this.#opponentBoardView = opponentBoardView;
    this.#gameOverBoardViews = gameOverBoardViews;

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

    this.display(START);
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
    this.display(BOARDS);
  }

  onEndTurn(event) {
    for (const handler of this.#endTurnHandlers) {
      handler(event);
    }
    this.instructionDisplay(false);
  }

  onReset(event) {
    this.display(START);
    for (const handler of this.#resetHandlers) {
      handler(event);
    }
  }

  update(gameState) {
    const turnTracker = gameState.turnTracker;
    const players = gameState.playerManager;

    //todo use gamestate utilities to get players
    let activePlayerIndex = turnTracker.activePlayer();
    let activePlayerBoard = players.getPlayer(activePlayerIndex).gameBoard;
    this.#playerBoardView.render(activePlayerBoard);

    let inactivePlayerIndex = turnTracker.inactivePlayer();
    let inactivePlayerBoard = players.getPlayer(inactivePlayerIndex).gameBoard;
    this.#opponentBoardView.render(inactivePlayerBoard);

    if (players.isGameOver()) {
      this.fillGameOverScreen(gameState);
      this.display(OVER);
    }

    this.instructionDisplay(
      turnTracker.isAttackDone(),
      players.isGameOver(),
      inactivePlayerBoard.lastAttackLanded(),
    );
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

  //todo : implement as dict that is enabled/disabled by key with iteration
  display(screen) {
    switch (screen) {
      case START:
        this.gameStartDisplay(true);
        this.gameBoardDisplay(false);
        this.gameOverDisplay(false);
        break;
      case BOARDS:
        this.gameStartDisplay(false);
        this.gameBoardDisplay(true);
        this.gameOverDisplay(false);
        break;
      case OVER:
        this.gameStartDisplay(false);
        this.gameBoardDisplay(false);
        this.gameOverDisplay(true);
        break;
    }
  }

  instructionDisplay(attackDone, gameOver = false, attackLanded = false) {
    if (!attackDone) {
      this.#instructionNode.textContent = "Choose target...";
      this.#endTurnButton.style.visibility = "hidden";
      return;
    }

    if (gameOver) {
      this.#endTurnButton.style.visibility = "hidden";
      this.#instructionNode.textContent = "Opponent sunk! You win.";
      return;
    }

    this.#endTurnButton.style.visibility = "visible";
    this.#instructionNode.textContent = attackLanded
      ? "Its a hit!"
      : "Attack missed.";
  }
}
