import React, { Component } from "react";
import { Link } from "react-router-dom";
import ValidationError from "../../Utils/ValidationError";
import BlackjackApiService from "../../services/auth-api-service";
import "./../../css/start.css";
import "./../../css/delete_game.css";

export default class DeleteGame extends Component {
  state = {
    deleteSet: {
      value: "",
      touched: false,
    },
  };
  handleSubmit = (ev) => {
    ev.preventDefault();
    const id = this.props.match.params.id;

    BlackjackApiService.deleteGame(id)
      .then(() => {
        this.props.history.push("/welcome");
      })
      .catch();
  };
  confirmDelete(deleteSet) {
    this.setState({
      deleteSet: { value: deleteSet, touched: true },
    });
  }

  validateDelete() {
    const deleteSet = this.state.deleteSet;
    if (deleteSet.value !== "DELETE") {
      return "Text must be exact match";
    }
  }

  render() {
    const validateError = this.validateDelete();
    return (
      <div className="delete_game_warning_page">
        <h1>Delete Game!!!</h1>
        <h2>You are about to delete</h2>
        <h2>your game!!! This action</h2>
        <h2 className="can_not_lettering">CAN NOT</h2>
        <h2>be undone. Please type</h2>
        <form className="delete_game_form" onSubmit={this.handleSubmit}>
          <label className="delete_label">
            <h2>DELETE to confirm.</h2>
          </label>
          {this.state.deleteSet.touched && (
            <ValidationError message={validateError} />
          )}
          <input
            className="delete_input"
            name="deleteSet"
            onChange={(e) => this.confirmDelete(e.target.value)}
          ></input>
          <span className="button_span">
            <Link to="/welcome">
              <button className="go_back_button">Go Back</button>
            </Link>

            <button
              className="game_delete_button"
              type="submit"
              id="#"
              disabled={this.validateDelete()}
            >
              Delete
            </button>
          </span>
        </form>
      </div>
    );
  }
}
