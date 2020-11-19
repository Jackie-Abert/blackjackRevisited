import React, { Component } from "react";
import "./css/game_table.css";
import "./css/start.css";
import "./css/card_flip.css";
import "./css/menu_button.css";
import './css/game_rules.css'
import Card from "./Card";
import Select from 'react-select';
import TokenService from "./services/token-service";
import { Link } from "react-router-dom";
import DeckManager from "./Content/DeckManager";
import BlackjackApiService from './services/blackjack-api-service'
import GameOver from './GameOver'


export default class GamePage extends Component {
  constructor(props){
    super(props) 
      this.state = {
        isClearable: false,
        isSearchable: false,
        gameId:props.match.params.id || '',
        wins: 0,
        losses: 0,
        moneytotal: 0,
        bank: 500,
        thisdeck: [],
        playerHandScore: 0,
        dealerHandScore: 0,
        playerHand: [],
        dealerHand: [],
        bet: 0,
        pot: 0,
        buttonPlayDisabled: true,
        buttonStayDisabled: true,
        buttonHitDisabled: true,
        defaultValue: true,
        endMessage: "",
        ishidden: "hidden",
        hiddenRules: "hiddenRules",
        hiddenMenu: "hiddenMenu",
        gameStarted: false,
        selectedOption: '0',
      };
  }



  componentDidMount(){
  const id = this.props.match.params.id
  BlackjackApiService.getGame(id)
  .then(data => {
    this.setState({
      gameId:id,
      bank:data.bank,
      wins:data.wins,
      losses:data.losses
    })
  })
}

  
  
  //this starts the GamePage, renders the deck. need to add a function that
  //adds a new shuffled deck if the old deck gets to a certain number so
  //the game does not break
  handleLogoutClick = () => {
    TokenService.clearAuthToken()
  }
  handleStartGame = () => {
    let newDeck = DeckManager.deckOfCards();
    let emptyCard = [{ key:"blank", suit: "cardback", numberValue: 0 }];

    this.setState({
      buttonPlayDisabled: true,
      buttonStayDisabled: false,
      buttonHitDisabled: false,
      gameStarted: true,
    });

    let newPlayerHand = [];
    let newDealerHand = [];
    newPlayerHand.push(newDeck.pop());
    newDealerHand.push(emptyCard.pop());
    newPlayerHand.push(newDeck.pop());
    newDealerHand.push(newDeck.pop());
    this.setState(
      {
        thisdeck: newDeck,
        playerHand: newPlayerHand,
        dealerHand: newDealerHand,
      },
      () => this.startCheck(this.state.playerHand, this.state.dealerHand)
    );
  };

  //this checks the initial state of the game to see if
  //player or deal have blackjack
  //need to hide dealer hand info from dom till player stays
  // also need to hide dealer card till stay. will do this from state.
  //minor details
  startCheck(playerHand, dealerHand) {
    let sumPlayerHand = this.check(this.state.playerHand);
    let sumDealerHand = this.check(this.state.dealerHand);
    let newBank = this.state.bank - this.state.bet;
    this.setState({
      playerHandScore: sumPlayerHand,
      dealerHandScore: sumDealerHand,
      bank: newBank,
    });
    if (sumPlayerHand === 21) {
      let winnings =
        Math.round(this.state.pot * 1.5 + this.state.pot) + this.state.bank;
      let newWin = this.state.wins + 1;
      this.setState({
        buttonPlayDisabled: false,
        buttonStayDisabled: true,
        buttonHitDisabled: true,
        endMessage: "Blackjack!",
        bank: winnings,
        ishidden: null,
        wins: newWin,
      });
      //pot is multiplied by 1.5 and returned to the bank
    }
  }
  //this takes in the array of the deck and reduces it to a single value
  check(hand) {
    return hand.reduce((a, b) => {
      return a + b.numberValue;
    }, 0);
  }
  //this checks the players hand to see if they have busted
  checkPlayer() {
    let sumPlayerHand = this.check(this.state.playerHand);
    if (sumPlayerHand > 21) {
      let newLoss = this.state.losses + 1;
      this.setState({
        playerHandScore: sumPlayerHand,
        buttonPlayDisabled: false,
        buttonStayDisabled: true,
        buttonHitDisabled: true,
        endMessage: "Bust! Dealer wins.",
        ishidden: null,
        losses: newLoss,
      });
    } else {
      this.setState({
        playerHandScore: sumPlayerHand,
      });
    }
  }
  //this checks the dealers hand to see if they have busted
  checkDealer() {
    let sumDealerHand = this.check(this.state.dealerHand);
    if (sumDealerHand > 21) {
      let winnings = this.state.pot * 2 + this.state.bank;
      let newWin = this.state.wins + 1;
      this.setState({
        dealerHandScore: sumDealerHand,
        buttonPlayDisabled: false,
        buttonStayDisabled: true,
        buttonHitDisabled: true,
        endMessage: "Dealer busts! Player Wins.",
        bank: winnings,
        ishidden: null,
        wins: newWin,
      });
    } else {
      return this.setState({
        dealerHandScore: sumDealerHand,
      });
    }
  }

  //player takes a card, this checks the player hand
  handleHit = () => {
    let card = this.state.thisdeck.pop();
    let newPlayerHand = [...this.state.playerHand, card];
    let newBank = this.state.bank - this.state.bet;
    this.setState(
      {
        playerHand: newPlayerHand,
        bank: newBank,
        pot: this.state.pot + this.state.bet,
        defaultValue: true,
        selectedOption:0
      },
      () => this.checkPlayer()
    );
  };

  //this function is supposed to be the ai after the player hits stay
  //it is supposed to loop through and deal cards untill player busts
  //or is >= 17, whatever comes first

  handleDealer = () => {
    let dealerSum = this.check(this.state.dealerHand);
    let newHand = this.state.dealerHand;
    while (dealerSum < 17) {
      let card = this.state.thisdeck.pop();
      newHand.push(card);
      dealerSum = this.check(newHand);
    }
    this.setState(
      {
        dealerHandScore: dealerSum,
        dealerHand: newHand,
      },
      () => this.checkDealer()
    );
    this.endGame();
  };

  //this handles the stay button, runs the ai for dealer and ends the game
  handleStay = () => {
    let newDealerHand = this.state.dealerHand;
    let card = this.state.thisdeck.pop();
    newDealerHand.splice(0, 1);
    newDealerHand.unshift(card);
    let dealerSum = this.check(newDealerHand);
    
    if(dealerSum === 21) {
      let newLoss = this.state.losses + 1;
      this.setState({
        buttonPlayDisabled: false,
        buttonStayDisabled: true,
        buttonHitDisabled: true,
        endMessage: "Dealer has blackjack.",
        ishidden: null,
        losses: newLoss,
      });
    } else{
    this.setState(
      {
        dealerHandScore: dealerSum,
        dealerHand: newDealerHand,
        buttonPlayDisabled: false,
        buttonStayDisabled: true,
        buttonHitDisabled: true,
        defaultValue: true,
      },
      () => this.handleDealer(this.state.dealerHand)
    );
  };
}

  endGame = () => {
    let dealer = this.check(this.state.dealerHand);
    let player = this.check(this.state.playerHand);
    let newendMessage = "";
    let winnings = this.state.bank;
    let newWin = this.state.wins;
    let newLoss = this.state.losses;

    if (player > dealer) {
      newendMessage = "Player Wins!";
      newWin = this.state.wins + 1;
      winnings = this.state.pot * 2 + this.state.bank;
    }

    if (player < dealer) {
      newendMessage = "Dealer Wins";
      newLoss = this.state.losses + 1;
    } else if (player === dealer) {
      newendMessage = "Draw";
    }
    return this.setState({
      bank: winnings,
      wins: newWin,
      losses: newLoss,
      endMessage: newendMessage,
      ishidden: null,
    });
  };
  //this is the button that clears the board and resets the state

  handleNewGame = () => {
    let gameId = this.props.match.params.id
    const { bank, losses, wins} = this.state
    //this function is necessary!!!
    BlackjackApiService.updateGame(gameId, bank, losses, wins)
    .then(data => {
    this.setState({
      deck: [],
      playerHandScore: 0,
      dealerHandScore: 0,
      playerHand: [],
      dealerHand: [],
      bet: 0,
      pot: 0,
      buttonPlayDisabled: true,
      buttonStayDisabled: true,
      buttonHitDisabled: true,
      defaultValue: true,
      endMessage: "",
      gameStarted: false,
      ishidden: "hidden",
    })
    });
  };

  handleChange = selectedOption => {
    if (selectedOption.value !== 0) {
      this.setState({
        selectedOption,
        buttonPlayDisabled: false,
        bet: Number(selectedOption.value),
        pot: Number(selectedOption.value),

      });
    }
  };
  handleButtonClickMenu = () => {
    if (this.state.hiddenMenu === "hiddenMenu") {
      this.setState({ hiddenMenu: "showMenu" });
    } else {
      this.setState({ hiddenMenu: "hiddenMenu" });
    }
  };
  handleButtonClickRules = () => {
    if (this.state.hiddenRules === "hiddenRules") {
      this.setState({ hiddenRules: "showRules" });
    } else {
      this.setState({ hiddenRules: "hiddenRules" });
    }
  };

  render() {
    const info = this.state
    const newbank = this.state.bank
    if(newbank <= 0) {
    return (
      <GameOver 
      {...info}/>
      )
    }
    const { selectedOption } = this.state;
    const playerDeal = this.state.playerHand.map((card) => <Card {...card} key={card.key} />);
    const dealerDeal = this.state.dealerHand.map((card) => <Card {...card} key={card.key} />);
    const options = [
      {value:1, label:'$1'},
      {value:5, label:'$5'},
      {value:10, label:'$10'},
      {value:25, label:'$25'},
      {value:50, label:'$50'},
      {value:100, label:'$100'},
    ];
    return (
      <div>
        <div className="start_page">
          <header className="game_page_header">
            <button
              className="menu_button"
              onClick={() => this.handleButtonClickMenu()}
            >
              Menu
            </button>
            <div className={this.state.hiddenMenu} id="hidden_menu">
              <div className='testContainer'>
              <Link to="/welcome">
                <button className="main_menu_button">Main Menu</button>
              </Link>
              <Link to="/login" onClick={this.handleLogoutClick}>
                <button className="logoff_button">Log Off</button>
              </Link>
              </div>
            </div>
            <button
              className="game_rules"
              onClick={() => this.handleButtonClickRules()}
            >
              ?
            </button>
            <div className={this.state.hiddenRules}>
              <div className="game_rules_page">
                <h2>Game Rules</h2>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
                  quia voluptas sit aspernatur aut odit aut fugit, sed quia
                  consequuntur magni dolores eos qui ratione voluptatem sequi
                  nesciunt.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
                  quia voluptas sit aspernatur aut odit aut fugit, sed quia
                  consequuntur magni dolores eos qui ratione voluptatem sequi
                  nesciunt.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
                  quia voluptas sit aspernatur aut odit aut fugit, sed quia
                  consequuntur magni dolores eos qui ratione voluptatem sequi
                  nesciunt.
                </p>
                <button
                  className="close_page_button"
                  onClick={() => this.handleButtonClickRules()}
                >
                  Close
                </button>
              </div>
            </div>
          </header>
          <span className="game_table">
            <span className="hidden_endgame_message">
              {this.state.endMessage}
              <button
                name="endgame"
                id="hidden_endgame_button"
                className={this.state.ishidden}
                onClick={this.handleNewGame}
              >
                Rematch
              </button>
            </span>
            <div className="dealer_cards">{dealerDeal}</div>

            <p>Dealer Cards Total: {this.state.dealerHandScore}</p>
            <div className="player_cards">{playerDeal}</div>

            <p>Player Cards Total: {this.state.playerHandScore}</p>
          </span>
        </div>
        <footer className="flex_footer">
            <span className="test_container">
              <span className="test_flex_container">
                <Select
                placeholder={"Bet"}
                isSearchable={false}
                isClearable={false}
                tag="Place bet"
                className="bet_select"
                value={selectedOption}
                onChange={this.handleChange}
                options={options}/>
                <h2>Pot: ${this.state.pot}</h2>
              </span>
              <span className="bank">
                <h2>Bank: ${this.state.bank}</h2>
              </span>
            </span>
            <span className="play_buttons_span">
              <button
                className="start_button"
                onClick={this.handleStartGame}
                disabled={
                  this.state.buttonPlayDisabled || this.state.gameStarted
                }
              >
                Play
              </button>
              <button
                className="start_button"
                onClick={this.handleHit}
                disabled={this.state.buttonHitDisabled}
              >
                Hit
              </button>
              <button
                className="stay_button"
                onClick={this.handleStay}
                disabled={this.state.buttonStayDisabled}
              >
                Stay
              </button>
            </span>
        </footer>
      </div>
    );
  }
}
