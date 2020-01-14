import { createStore } from "redux";
let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true };
  }
  if (action.type === "logout") {
    return { ...state, loggedIn: false };
  }
  if (action.type === "set-messages") {
    return { ...state, msgs: action.messages };
  }
  if (action.type === "set-all-rooms") {
    return { ...state, chatRooms: action.rooms };
  }
  if (action.type === "set-active-room") {
    return { ...state, activeChatRoom: action.newRoom };
  }
  return state;
};
const store = createStore(
  reducer,
  { msgs: [], loggedIn: false, activeChatRoom: "", chatRooms: {} },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
