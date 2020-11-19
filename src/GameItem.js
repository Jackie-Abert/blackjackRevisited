import React, { Component } from "react";
import LoadGameButton from './Components/Buttons/LoadGameButton'
import { Link } from 'react-router-dom'
import "./css/start.css";
import "./css/welcome_user.css";
import './css/game_item.css'

export default class GameItem extends Component {
  state = {
    hidden:'hidden'    
  };
  handleButtonClick = () => {
      if(this.state.hidden === 'hidden') {
        this.setState({hidden:'show'});
    } else {
      this.setState({hidden:'hidden'})
    }
  }
  render() {
    const { id, array, wins, losses, bank } = this.props

    return (
      <div className="game_item">
        <button className="game_list_item" onClick={() => this.handleButtonClick()}>
    <h2>Game {array + 1} {this.state.gameOver}</h2>
        </button>
          <div className={this.state.hidden}>
            <ul className="hidden_accordion_list">
              <li>Total games played: {wins + losses}</li>
              <li>Wins: {wins} Losses: {losses}</li>
              <li>Money in bank: {bank}</li>
            </ul>
            <LoadGameButton {...this.props}/>
            <Link to={'/delete/'+id}><button className="game_delete_button" id={id}>Delete</button></Link>
          </div>
      </div>
    );
  }
}