import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedCreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newRoomInput: ""
    };
  }
  handleNewRoomChange = e => {
    this.setState({ newRoomInput: e.target.value });
  };
  handleAddRoom = async e => {
    e.preventDefault();
    const newRoomId = this.state.newRoomInput
      .replace(/[^a-zA-Z ]/g, "")
      .split(" ")
      .join("")
      .toLowerCase();
    const newRoomName = this.state.newRoomInput;
    let data = new FormData();
    data.append("id", newRoomId);
    data.append("name", newRoomName);
    this.setState({ newRoomInput: "" });
    await fetch("/add-room", {
      method: "POST",
      body: data
    });
    this.props.addRoomsToStore();
    this.props.dispatch({
      type: "set-active-room",
      newRoom: newRoomId
    });
  };
  render() {
    return (
      <form onSubmit={this.handleAddRoom}>
        <input
          onChange={this.handleNewRoomChange}
          value={this.state.newRoomInput}
          type="text"
        />
        <button type="submit">Create Room</button>
      </form>
    );
  }
}
const CreateRoom = connect()(UnconnectedCreateRoom);
export default CreateRoom;
