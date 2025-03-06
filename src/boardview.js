export default class BoardView {
  container;
  #forActivePlayer;

  constructor(domID, forActivePlayer) {
    this.container = document.getElementById(domID);
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
            ? "black"
            : "light-blue";
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
