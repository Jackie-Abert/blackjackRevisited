import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./../../css/start.css";


export default class LandingPage extends Component {

  render() {
    return (
      <div className="start_page">
        <span className="start_page_buttons">
        <Link to='/register'><button className="create_account_button">Create Account</button></Link>
        <Link to='/login'><button className="login_button">Log In</button></Link>
        </span>
      </div>
    );
  }
}
