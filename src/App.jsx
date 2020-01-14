import React, { Component } from "react";
import { connect } from "react-redux";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Logout from "./Logout.jsx";
import ChatRoom from "./ChatRoom.jsx";
class UnconnectedApp extends Component {
  render = () => {
    if (this.props.lgin) {
      return (
        <div>
          <Logout />
          <ChatRoom />
        </div>
      );
    }
    return (
      <div>
        <h1>Signup</h1>
        <Signup />
        <h1>Login</h1>
        <Login />
      </div>
    );
  };
}
const mapStateToProps = state => {
  return { lgin: state.loggedIn };
};
const App = connect(mapStateToProps)(UnconnectedApp);
export default App;
