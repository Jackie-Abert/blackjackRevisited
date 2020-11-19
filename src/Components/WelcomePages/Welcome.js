import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./../../css/start.css";
import "./../../css/welcome_user.css";
import GameItem from "../../GameItem";
import TokenService from "../../services/token-service";
import BlackjackApiService from '../../services/blackjack-api-service'
import NewGameButton from "../Buttons/NewGameButton";

export default class Welcome extends Component {
  constructor(props) {
    super(props);
  this.state = {
    games:[]
  }
}

handleLogoutClick = () => {
  TokenService.clearAuthToken()
}

  componentDidMount() {
    BlackjackApiService.getGames()
    .then(data => {
      this.setState({ 
        games: data.map((game, index) => (
          <GameItem
            array={index}
            key={game.id}
            id={game.id}
            bank={game.bank}
            wins={game.wins}
            losses={game.losses}
            moneytotal={game.moneytotal}
            history={this.props.history}
          />
        ))
       })
    })
  }
  render() {
    return (
      <div className="welcome_user_page">
        <span className="welcome_user_buttons">

            <NewGameButton 
            {...this.props}
            />
          <Link to="/" onClick={this.handleLogoutClick}>
            <button className="logoff_button">Log Off</button>
          </Link>
        </span>
        <ul>
          {this.state.games}
        </ul>
      </div>
    );
  }
}
