import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Start from "./Components/StartPages/LandingPage";
import Login from "./Components/StartPages/Login";
import PublicOnlyRoute from "./Utils/PublicOnlyRoute";
import PrivateOnlyRoute from "./Utils/PrivateOnlyRoute";
import Register from "./Components/StartPages/Register";
import GamePage from "./GamePage";
import Welcome from "./Components/WelcomePages/Welcome";
import DeleteGame from "./Components/WelcomePages/DeleteGame";
import Header from "./Components/Header/Header";

export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <PublicOnlyRoute component={Register} path="/register">
          </PublicOnlyRoute>
          <PublicOnlyRoute component={Login} path="/login">
          </PublicOnlyRoute>
          <PrivateOnlyRoute component={Welcome} path="/welcome">
          </PrivateOnlyRoute>
          <PrivateOnlyRoute component={GamePage} path="/game/:id">
          </PrivateOnlyRoute>
          <PrivateOnlyRoute component={DeleteGame} path="/delete/:id">
          </PrivateOnlyRoute>
          <Route path="/">
            <Start />
          </Route>
        </Switch>
      </div>
    );
  }
}
