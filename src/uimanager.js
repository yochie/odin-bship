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
  #startPVPButton;
  #startPVBButton;
  #endTurnButton;
  #resetButton;
  #startTurnButton;
  #generateBoardButton;
  #placementDoneButton;

  //map of screen keys to dom nodes
  #screens;

  //sub node for board view
  #instructionNode;

  //handlers
  #attackHandlers;
  #startPVPHandlers;
  #startPVBHandlers;
  #endTurnHandlers;
  #resetHandlers;
  #startTurnHandlers;
  #generateBoardHandlers;
  #placementDoneHandlers;

  constructor(
    playerBoardView,
    opponentBoardView,
    playerView,
    opponentView,
    startPVPButton,
    startPVBButton,
    startTurnButton,
    endTurnButton,
    resetButton,
    generateBoardButton,
    placementDoneButton,
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
    this.#startPVPButton = startPVPButton;
    this.#startPVBButton = startPVBButton;
    this.#endTurnButton = endTurnButton;
    this.#resetButton = resetButton;
    this.#startTurnButton = startTurnButton;
    this.#generateBoardButton = generateBoardButton;
    this.#placementDoneButton = placementDoneButton;

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
    this.#startPVPHandlers = [];
    this.#startPVBHandlers = [];
    this.#endTurnHandlers = [];
    this.#resetHandlers = [];
    this.#startTurnHandlers = [];
    this.#generateBoardHandlers = [];
    this.#placementDoneHandlers = [];

    //register event listeners
    this.#opponentBoardView.container.addEventListener("click", (event) => {
      this.onAttack(event);
    });
    this.#startPVPButton.addEventListener("click", (event) =>
      this.onStartPVPGame(event),
    );
    this.#startPVBButton.addEventListener("click", (event) =>
      this.onStartPVBGame(event),
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
    this.#placementDoneButton.addEventListener("click", (event) => {
      this.onPlacementDone(event);
    });
  }

  addAttackHandler(callback) {
    this.#attackHandlers.push(callback);
  }

  addStartPVPHandler(callback) {
    this.#startPVPHandlers.push(callback);
  }

  addStartPVBHandler(callback) {
    this.#startPVBHandlers.push(callback);
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

  addPlacementDoneHandler(callback) {
    this.#placementDoneHandlers.push(callback);
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

  onStartPVPGame(event) {
    let gameState;
    for (const handler of this.#startPVPHandlers) {
      gameState = handler(event);
    }
    this.update(gameState);
  }

  onStartPVBGame(event) {
    let gameState;
    for (const handler of this.#startPVBHandlers) {
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

  onPlacementDone(event) {
    let gameState = null;
    for (const handler of this.#placementDoneHandlers) {
      gameState = handler(event);
    }
    this.update(gameState);
  }

  update(gameState) {
    //before game start or if no handler registered (should not happen)
    if (gameState === null) {
      this.displayScreen(START);
      return;
    }
    const turnTracker = gameState.turnTracker;
    const players = gameState.playerManager;

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
      inactivePlayerBoard.lastHitSize(),
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

  instructionDisplay(attackDone, attackLanded = false, shipSize = 0) {
    if (!attackDone) {
      this.#instructionNode.textContent = "Choose target...";
      this.#endTurnButton.style.visibility = "hidden";
      return;
    }

    this.#endTurnButton.style.visibility = "visible";
    this.#instructionNode.textContent = attackLanded
      ? `Hit a ${shipSize} sized ship!`
      : "Attack missed.";
  }
}
