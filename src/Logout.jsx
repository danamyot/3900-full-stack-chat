import React, { Component } from "react";
import { connect } from "react-redux";

class Logout extends Component {
  logout = () => {
    this.props.dispatch({
      type: "logout"
    });
  };
  render = () => {
    return <button onClick={this.logout}>Logout</button>;
  };
}

export default connect()(Logout);
