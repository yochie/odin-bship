import BoardView from "./boardview.js";
//screen keys
const BOARDS = "boards";
const START = "start";
const OVER = "over";
const SWAP = "swap";
const SETUP = "setup";
const PLACEMENT = "placement";

export default class UIManager {
  //board views
  #playerBoardView;
  #opponentBoardView;
  #gameOverBoardViews;
  #playerView;
  #opponentView;
  #placementView;

  //buttons
  #startButton;
  #endTurnButton;
  #resetButton;
  #startTurnButton;
  #generateBoardButton;

  //map of screen keys to dom nodes
  #screens;

  //sub node for board view
  #instructionNode;

  //handlers
  #attackHandlers;
  #startHandlers;
  #endTurnHandlers;
  #resetHandlers;
  #startTurnHandlers;
  #generateBoardHandlers;

  constructor(
    playerBoardView,
    opponentBoardView,
    playerView,
    opponentView,
    startButton,
    startTurnButton,
    endTurnButton,
    resetButton,
    generateBoardButton,
    gameOverNode,
    gameStartNode,
    placementNode,
    turnSwapNode,
    gameBoardNode,
    instructionNode,
    gameOverBoardViews,
    placementView,
  ) {
    //dom buttons
    this.#startButton = startButton;
    this.#endTurnButton = endTurnButton;
    this.#resetButton = resetButton;
    this.#startTurnButton = startTurnButton;
    this.#generateBoardButton = generateBoardButton;

    //view nodes
    this.#screens = new Map();
    this.#screens.set(OVER, gameOverNode);
    this.#screens.set(START, gameStartNode);
    this.#screens.set(BOARDS, gameBoardNode);
    this.#screens.set(SWAP, turnSwapNode);
    this.#screens.set(PLACEMENT, placementNode);

    //sub node for board view
    this.#instructionNode = instructionNode;

    //dom view/managers
    this.#playerBoardView = playerBoardView;
    this.#opponentBoardView = opponentBoardView;
    this.#playerView = playerView;
    this.#opponentView = opponentView;
    this.#gameOverBoardViews = gameOverBoardViews;
    this.#placementView = placementView;

    //handlers lists
    this.#attackHandlers = [];
    this.#startHandlers = [];
    this.#endTurnHandlers = [];
    this.#resetHandlers = [];
    this.#startTurnHandlers = [];
    this.#generateBoardHandlers = [];

    //register event listeners
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
    this.#generateBoardButton.addEventListener("click", (event) =>
      this.onGenerateBoard(event),
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

  addGenerateBoardHandler(callback) {
    this.#generateBoardHandlers.push(callback);
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

  onGenerateBoard(event) {
    let gameState = null;
    for (const handler of this.#generateBoardHandlers) {
      gameState = handler(event);
    }
    this.update(gameState);
  }

  update(gameState) {
    //in case no even handlers are registered and update is called needlessly
    if (gameState === null) {
      return;
    }
    const turnTracker = gameState.turnTracker;
    const players = gameState.playerManager;

    if (!turnTracker.isGameStarted()) {
      this.displayScreen(START);
      return;
    }

    if (!players.isPlacementDone()) {
      this.displayScreen(PLACEMENT);
      this.fillPlacementScreen(gameState);
      return;
    }

    if (!turnTracker.isTurnStarted()) {
      this.displayScreen(SWAP);
      this.fillSwapScreen(players.getIndex(gameState.activePlayer()));
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

    this.#playerView.renderForTurn(
      gameState.activePlayer(),
      true,
      players.getIndex(gameState.activePlayer()),
    );

    this.#opponentView.renderForTurn(
      gameState.inactivePlayer(),
      false,
      players.getIndex(gameState.inactivePlayer()),
    );

    this.displayScreen(BOARDS);
  }

  fillPlacementScreen(gameState) {
    const screen = this.#screens.get(PLACEMENT);
    const playerTitle = screen.querySelector(".player-title");
    const activePlayer = gameState.activePlayer();
    const playerIndex = gameState.playerManager.getIndex(activePlayer);
    playerTitle.textContent = `Player ${playerIndex + 1}`;
    this.#placementView.render(activePlayer.gameBoard);
  }

  fillSwapScreen(playerIndex) {
    const swapNode = this.#screens.get(SWAP);
    const swapMessage = swapNode.querySelector(".swap-message");
    swapMessage.textContent = `Turn: Player ${playerIndex + 1}`;
  }

  fillGameOverScreen(gameState) {
    const players = gameState.playerManager;
    const playerCount = 2;
    for (let i = 0; i < playerCount; i++) {
      this.#gameOverBoardViews[i].render(players.getPlayer(i).gameBoard);
    }
  }

  displayScreen(screen) {
    for (const [key, view] of this.#screens) {
      if (key === screen) {
        view.classList.add("active");
      } else {
        view.classList.remove("active");
      }
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
