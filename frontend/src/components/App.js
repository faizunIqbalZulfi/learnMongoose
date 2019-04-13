import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import cookies from "universal-cookie";

import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import { keepLogin } from "../actions/index";
import Profile from "./Profile";

const cookie = new cookies();

class App extends Component {
  componentDidMount() {
    this.props.keepLogin(
      cookie.get("masihLogin"),
      cookie.get("idLogin"),
      cookie.get("ageLogin")
    );
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/profile" component={Profile} />
        </div>
      </BrowserRouter>
    );
  }
}

// const mapStateToProps =(state)=>{
//     return {}
// }

export default connect(
  null,
  { keepLogin }
)(App);
