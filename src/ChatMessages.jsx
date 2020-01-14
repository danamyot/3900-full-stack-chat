import React, { Component } from "react";
import { connect } from "react-redux";
class UnconnectedChatMessages extends Component {
  componentDidMount = () => {
    let updateMessages = async () => {
      let fetchedMessages = await (
        await fetch(`/messages?r=${this.props.activeRoom}`)
      ).json();
      this.props.dispatch({
        type: "set-messages",
        messages: fetchedMessages
      });
    };
    setInterval(updateMessages, 300);
  };
  render = () => {
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
    activeRoom: state.activeChatRoom,
    messages: state.msgs
  };
};
let Chat = connect(mapStateToProps)(UnconnectedChatMessages);
export default Chat;
