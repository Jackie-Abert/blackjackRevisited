import React, { Component } from "react";
import "./css/game_table.css";
import "./css/start.css";
import "./css/card_flip.css";
import clubs from "./Images/clubs.png";
import hearts from "./Images/hearts.png";
import diamonds from "./Images/diamonds.png";
import spades from "./Images/spades.png";
import cardback from "./Images/cardback.png";

export default class Card extends Component {
  state = {
    cardBack: true,
  };

  render(props) {
    const { faceValue, suit } = this.props;
    let image = clubs;

    let cardRender = 
    suit === "cardback"
      ? (image = cardback)
      : suit === "diamonds"
      ? (image = diamonds)
      : suit === "hearts"
      ? (image = hearts)
      : suit === "spades"
      ? (image = spades)
      : (image = clubs);
    if (image === cardback) {
      cardRender = (
        <div className="flip_card">
          <div className="content">
            {/* <div className="front_of_card"></div> */}
            <div className="card_back">
              
            </div>
          </div>
        </div>
      );
    } else {
      cardRender = (
        <div className="flip_card">
          <div className="content">
            {/* <div className="front_of_card"></div> */}
            <div className="back_of_card">
              <span className="card_face">
                <div className="suit_top">
                  <img src={image} alt="{image}" />
                  <img src={image} alt="{image}" />
                </div>
                <span className="face_value">{faceValue}</span>
                <div className="suit_bottom">
                  <img src={image} alt="{image}" />
                  <img src={image} alt="{image}" />
                </div>
              </span>
            </div>
          </div>
        </div>
      );
    }
    return (
     cardRender
    );
  }
}
