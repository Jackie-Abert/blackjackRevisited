import React, { Component } from "react";
import "./../../css/start.css";
import "./../../css/welcome_user.css";
import BlackjackApiService from "../../services/blackjack-api-service";

export default class LoadGameButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  validateLostGame = () => {
    const broke = this.props.bank;
    if(broke <= 0) {
      return 'Game Over'
    }
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
    const id = this.props.id;
    BlackjackApiService.getGame(id)
      .then(() => {
        this.props.history.push("/game/" + id);
      })
      .catch();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <button className="play_game_button" disabled={this.validateLostGame()}>
          Play
        </button>
      </form>
    );
  }
}
