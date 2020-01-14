import React, { Component } from "react";
import { connect } from "react-redux";
class UnconnectedChatMessages extends Component {
  componentDidMount = () => {
    let updateMessages = async () => {
      let response = await fetch("/messages");
      let responseBody = await response.text();
      let parsed = JSON.parse(responseBody);
      this.props.dispatch({
        type: "set-messages",
        messages: parsed
      });
    };
    // setInterval(updateMessages, 300);
  };
  render = () => {
    // console.log(this.props);
    let msgToElement = (e, i) => (
      <li key={i}>
        {" "}
        {e.username.toUpperCase()}: {e.message}{" "}
      </li>
    );
    return (
      <div>
        <ul>{this.props.messages.map(msgToElement)}</ul>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    messages: state.msgs
  };
};
let Chat = connect(mapStateToProps)(UnconnectedChatMessages);
export default Chat;
