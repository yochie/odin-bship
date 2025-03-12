export default class PlayerView {
  #container;
  #title;
  constructor(node) {
    this.#container = node;
    this.#title = this.#container.querySelector(".player-title");
  }

  //todo: change to icon for human vs bot
  renderForTurn(player, isActive, index) {
    this.#title.textContent = `${isActive ? "You" : "Opponent"} (${player.isBot ? "Bot" : "Human"} - P${index + 1})`;
  }
}
