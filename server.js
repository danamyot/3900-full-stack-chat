const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer();
const cookieParser = require("cookie-parser");
const reloadMagic = require("./reload-magic.js");

app.use(cookieParser());
reloadMagic(app);

const passwords = {};
const sessions = {};
const chatRooms = {};

const generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};

app.use("/", express.static("build"));

app.post("/signup", upload.none(), (req, res) => {
  const username = req.body.username;
  const enteredPassword = req.body.password;
  if (!passwords[username]) {
    passwords[username] = enteredPassword;
    const sessionId = generateId();
    sessions[sessionId] = username;
    res.cookie("sid", sessionId);
    return res.send(JSON.stringify({ success: true }));
  }
  return res.send(JSON.stringify({ success: false }));
});

app.post("/login", upload.none(), (req, res) => {
  const username = req.body.username;
  const enteredPassword = req.body.password;
  const expectedPassword = passwords[username];
  if (enteredPassword === expectedPassword) {
    const sessionId = generateId();
    sessions[sessionId] = username;
    res.cookie("sid", sessionId);
    return res.send(JSON.stringify({ success: true }));
  }
  res.send(JSON.stringify({ success: false }));
});

app.get("/rooms", function(_, res) {
  const rooms = {};
  Object.keys(chatRooms).forEach(room => {
    rooms[room] = {
      id: room,
      name: chatRooms[room].name
    };
  });
  return res.send(JSON.stringify({ rooms }));
});

app.post("/add-room", upload.none(), (req, res) => {
  chatRooms[req.body.id] = req.body;
  chatRooms[req.body.id].messages = [];
  return res.send(JSON.stringify({ success: true }));
});

app.get("/messages", function(req, res) {
  const sessionID = req.cookies.sid;
  const chatRoom = req.query.r;
  if (!sessions[sessionID]) {
    return;
  }
  return res.send(JSON.stringify(chatRooms[chatRoom].messages));
});

app.post("/newmessage", upload.none(), (req, res) => {
  const sessionId = req.cookies.sid;
  const username = sessions[sessionId];
  const chatRoom = req.query.r;
  const msg = req.body.msg;
  const newMsg = { username: username, message: msg };
  chatRooms[chatRoom].messages = chatRooms[chatRoom].messages.concat(newMsg);
  res.send(JSON.stringify({ success: true }));
});

app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000);
