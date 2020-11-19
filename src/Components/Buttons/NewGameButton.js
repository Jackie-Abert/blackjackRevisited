import React, { Component } from "react";
import './../../css/start.css'
import "./../../css/welcome_user.css";
import BlackjackApiService from "../../services/blackjack-api-service";

export default class NewGameButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
        bank: 500,
        wins: 0,
        losses: 0,
        };
        }
  
    handleSubmit = (ev) => {
    ev.preventDefault();
    // const id = this.props.id
    // const { bank, wins, losses } = this.state;
    // const game = { bank, wins, losses }

    BlackjackApiService.postGame()
      .then(() => {
        window.location.reload();
      })
      .catch();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <button className="new_game_button">New Game</button>
      </form>
    );
  }
}
