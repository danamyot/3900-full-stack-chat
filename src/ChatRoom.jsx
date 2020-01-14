import React, { Component } from "react";
import { connect, connectAdvanced } from "react-redux";
import ChatMessages from "./ChatMessages.jsx";
import ChatForm from "./ChatForm.jsx";
import CreateRoom from "./CreateRoom.jsx";

class UnconnectedChatRoom extends Component {
  componentDidMount = () => {
    this.addRoomsToStore();
  };
  addRoomsToStore = async () => {
    const fetchRooms = await (await fetch("/rooms")).json();
    const rooms = fetchRooms.rooms;
    this.props.dispatch({
      type: "set-all-rooms",
      rooms
    });
    if (!this.props.activeRoom) {
      this.props.dispatch({
        type: "set-active-room",
        newRoom: Object.keys(rooms)[0]
      });
    }
  };
  handleRoomSelect = e => {
    this.setState({ activeRoom: e.target.value });
    this.props.dispatch({
      type: "set-active-room",
      newRoom: e.target.value
    });
  };
  renderRoomSelector = () => {
    return (
      <select onChange={this.handleRoomSelect} value={this.props.activeRoom}>
        {Object.keys(this.props.chatRooms).map(room => {
          const roomInfo = this.props.chatRooms[room];
          return (
            <option value={roomInfo.id} key={roomInfo.id}>
              {roomInfo.name}
            </option>
          );
        })}
      </select>
    );
  };
  render = () => {
    return (
      <div>
        {Object.keys(this.props.chatRooms).length ? (
          <>
            {Object.keys(this.props.chatRooms).length > 1 &&
              this.renderRoomSelector()}
            <ChatMessages />
            <ChatForm activeRoom={this.props.activeRoom} />
            <CreateRoom addRoomsToStore={this.addRoomsToStore} />
          </>
        ) : (
          <CreateRoom addRoomsToStore={this.addRoomsToStore} />
        )}
      </div>
    );
  };
}
let mapStateToProps = state => {
  return { activeRoom: state.activeChatRoom, chatRooms: state.chatRooms };
};
const ChatRoom = connect(mapStateToProps)(UnconnectedChatRoom);
export default ChatRoom;
