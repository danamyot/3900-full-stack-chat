import React, { Component } from "react";
import { connect } from "react-redux";
class UnconnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  handleUsernameChange = event => {
    this.setState({ username: event.target.value });
  };
  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };
  handleSubmit = async evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    let response = await fetch("/login", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (!body.success) {
      alert("login failed");
      return;
    }
    this.props.dispatch({
      type: "login-success"
    });
  };
  render = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        Username
        <input type="text" onChange={this.handleUsernameChange} />
        Password
        <input type="text" onChange={this.handlePasswordChange} />
        <input type="submit" />
      </form>
    );
  };
}
let Login = connect()(UnconnectedLogin);
export default Login;
