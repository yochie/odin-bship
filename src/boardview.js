import { HIT, MISS } from "./gameboard.js";

const WATER_COLOR = "lightblue";
const SHIP_COLOR = "black";
const HIT_COLOR = "red";
const SUNK_COLOR = "#FFCCCB";

export default class BoardView {
  container;
  #forActivePlayer;

  constructor(node, forActivePlayer) {
    this.container = node;
    this.#forActivePlayer = forActivePlayer;
  }

  render(board) {
    this.container.replaceChildren();
    this.container.style.setProperty("--rows", board.height);
    this.container.style.setProperty("--cols", board.width);

    for (let x = 0; x < board.width; x++) {
      for (let y = 0; y < board.height; y++) {
        let position = { x, y };
        const cell = document.createElement("div");
        cell.classList.add("board-cell");
        cell.setAttribute("data-x", x);
        cell.setAttribute("data-y", y);

        if (this.#forActivePlayer) {
          cell.style.backgroundColor = this.getActiveColor(
            board.hasShipAt(position),
            board.hitAt(position) === HIT,
            board.isShipSunkAt(position),
          );

          if (
            board.lastHitPosition() !== null &&
            board.lastHitPosition().x === x &&
            board.lastHitPosition().y === y
          ) {
            cell.classList.add("highlighted");
          } else {
            cell.classList.remove("highlighted");
          }
        } else {
          cell.style.backgroundColor = this.getInactiveColor(
            board.hitAt(position) === HIT,
            board.isShipSunkAt(position),
          );
        }
        switch (board.hitAt({ x, y })) {
          case HIT:
            cell.textContent = "X";
            break;
          case MISS:
            cell.textContent = "O";
            break;
          default:
            cell.textContent = "";
        }

        this.container.appendChild(cell);
      }
    }
  }

  getActiveColor(isShip, isHit, isSunk) {
    if (!isShip) {
      return WATER_COLOR;
    }

    if (!isHit) {
      return SHIP_COLOR;
    }

    if (!isSunk) {
      return HIT_COLOR;
    }

    return SUNK_COLOR;
  }

  getInactiveColor(isHit, isSunk) {
    if (!isHit) {
      return WATER_COLOR;
    }

    if (!isSunk) {
      return HIT_COLOR;
    }

    return SUNK_COLOR;
  }

  static parsePosition(element) {
    const positionX = element.getAttribute("data-x");
    const positionY = element.getAttribute("data-y");
    const position = { x: +positionX, y: +positionY };
    return position;
  }
}
