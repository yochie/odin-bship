export default class DumbAI {
  constructor() {}

  chooseTarget(gameBoard) {
    if (gameBoard.isFullySunk()) {
      throw new Error(
        "Can't apply this ai to sunk boards. No break condition.",
      );
    }

    let target = null;
    do {
      const x = Math.floor(Math.random() * gameBoard.width);
      const y = Math.floor(Math.random() * gameBoard.height);
      target = { x, y };
    } while (gameBoard.hitAt(target) !== null);

    return target;
  }
}
