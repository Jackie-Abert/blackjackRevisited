import { Link } from "react-router-dom";
import React, { Component } from "react";
import BlackjackApiService from "./services/blackjack-api-service";

export default class GameOver extends Component {
  state = {
    bank: 0,
    wins: 0,
    losses: 0,
  };

  render() {
    const bank = 0;
    const { wins, losses, gameId } = this.props;
    const total = wins + losses
    this.setState = {
          gameid:gameId,
          bank: bank,
          wins: wins,
          losses: losses,
        };
    BlackjackApiService.updateGame(gameId, wins, losses, bank)
      .then(() => {
        
      })
      .catch();

    return (
      <div>
        <div>
          <h2>Game Over! You have run out of money. That's too bad. Please start a new game.</h2>
          <h2>Wins: {wins} Losses: {losses}</h2>
          <h2>Total games played: {total}</h2>
        </div>
        <Link to="/welcome">
          <button className="main_menu_button">Main Menu</button>
        </Link>
      </div>
    );
  }
}
