import React, { Component } from "react";
class ChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };
  }
  handleMessageChange = event => {
    this.setState({ message: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    let data = new FormData();
    data.append("msg", this.state.message);
    this.setState({ message: "" });
    fetch("/newmessage", {
      method: "POST",
      body: data,
      credentials: "include"
    });
  };
  render = () => {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleMessageChange}
            value={this.state.message}
            type="text"
          />
          <input type="submit" />
        </form>
      </div>
    );
  };
}
export default ChatForm;
