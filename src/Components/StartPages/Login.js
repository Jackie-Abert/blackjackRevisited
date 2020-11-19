import React, { Component } from "react";
import { Link } from "react-router-dom";
import TokenService from "../../services/token-service";
import AuthApiService from "../../services/auth-api-service";
import "./../../css/log_in.css";
import "./../../css/start.css";

export default class Login extends Component {
  state = {
    error:''
  }
  handleSubmitJwtAuth = (ev) => {
    ev.preventDefault();
    this.setState({ error: null });
    const { user_name, password } = ev.target;
    AuthApiService.postLogin({
      user_name: user_name.value,
      password: password.value,
    })
      .then((res) => {
        user_name.value = "";
        password.value = "";
        TokenService.saveAuthToken(res.authToken);
        this.props.history.push('/welcome')
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
    };
    render() {
    let error = this.state.error
    return (
      <div className="login_page">
        <form className="login_page_form" onSubmit={this.handleSubmitJwtAuth}>
          <label className="name">Name:</label>
          <input
            className="name"
            required
            name="user_name"
            id="Login__user_name"
          ></input>
          <label className="password">Password:</label>
          <input
            className="password"
            required
            name="password"
            type="password"
            id="Login__password"
          ></input>
          <h3>{error}</h3>
          <span>
              <button className="login_login_button" type="submit">
                Log In
              </button>
            <Link to="/">
              <button className="goback_button" type="submit">
                Go Back
              </button>
            </Link>
            <h3>
              Demo name is 'demo'.
              </h3>
              <h3>
                Demo password is 'password111'.
              </h3>
              <h3>
                Good luck!
              </h3>
          </span>
        </form>
        <footer></footer>
      </div>
    );
  }
}
