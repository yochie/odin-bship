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
        const cell = document.createElement("div");
        cell.classList.add("board-cell");
        cell.setAttribute("data-x", x);
        cell.setAttribute("data-y", y);

        if (this.#forActivePlayer) {
          cell.style.backgroundColor = board.hasShipAt({ x, y })
            ? board.hitAt({ x, y }) === "hit"
              ? "red"
              : "black"
            : "lightblue";
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
          cell.style.backgroundColor =
            board.hitAt({ x, y }) === "hit" ? "red" : "lightblue";
        }

        switch (board.hitAt({ x, y })) {
          case "hit":
            cell.textContent = "X";
            break;
          case "miss":
            cell.textContent = "O";
            break;
          default:
            cell.textContent = "";
        }

        this.container.appendChild(cell);
      }
    }
  }

  static parsePosition(element) {
    const positionX = element.getAttribute("data-x");
    const positionY = element.getAttribute("data-y");
    const position = { x: +positionX, y: +positionY };
    return position;
  }
}
